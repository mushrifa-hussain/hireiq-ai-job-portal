const express = require('express');
const multer = require('multer');
const fs = require('node:fs');
const path = require('node:path');
const { PDFParse } = require('pdf-parse');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { analyzeResume } = require('../services/gemini');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed'));
    }
    cb(null, true);
  },
});

router.post(
  '/jobs/:jobId/apply',
  authenticate,
  requireRole('jobseeker'),
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Resume PDF required' });
      }
      const jobId = parseInt(req.params.jobId);
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Job not found' });
      }

      const existing = await prisma.application.findFirst({
        where: { userId: req.user.id, jobId },
      });
      if (existing) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({ error: 'You have already applied to this job' });
      }

      const dataBuffer = fs.readFileSync(req.file.path);
      let resumeText = '';
      try {
        const parser = new PDFParse({ data: new Uint8Array(dataBuffer) });
        const parsed = await parser.getText();
        resumeText = parsed.text || '';
        await parser.destroy();
        console.log(`[apply] PDF parsed: ${resumeText.length} chars from ${req.file.originalname}`);
      } catch (e) {
        console.error('[apply] PDF parse failed:', e.message, e.stack);
      }

      let analysis;
      try {
        console.log(`[apply] Running AI analysis (job #${jobId}, resume ${resumeText.length} chars)`);
        analysis = await analyzeResume(resumeText, job);
        console.log(`[apply] AI analysis complete: score=${analysis.score}, skills=${analysis.skills.length}, missing=${analysis.missing.length}`);
      } catch (e) {
        const msg = (e && e.message) || String(e);
        console.error('[apply] AI analysis FAILED');
        console.error('  Error:', msg);
        if (e && e.stack) console.error('  Stack:', e.stack.split('\n').slice(0, 5).join('\n'));
        const transient = /503|429|overloaded|high demand|unavailable|rate.?limit/i.test(msg);
        analysis = {
          score: 0,
          skills: [],
          missing: [],
          suggestions: [
            transient
              ? 'The AI service is temporarily overloaded. Please try again in a minute — your application has been recorded.'
              : 'AI analysis could not be completed for this resume. Please contact support if this persists.',
          ],
        };
      }

      const application = await prisma.application.create({
        data: {
          userId: req.user.id,
          jobId,
          resumePath: path.basename(req.file.path),
          analysis: {
            create: {
              userId: req.user.id,
              score: analysis.score,
              skills: JSON.stringify(analysis.skills),
              missing: JSON.stringify(analysis.missing),
              suggestions: JSON.stringify(analysis.suggestions),
            },
          },
        },
        include: { analysis: true, job: true },
      });

      res.status(201).json({
        application,
        analysis: {
          score: analysis.score,
          skills: analysis.skills,
          missing: analysis.missing,
          suggestions: analysis.suggestions,
        },
      });
    } catch (err) {
      console.error(err);
      if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch {}
      }
      res.status(500).json({ error: 'Application failed' });
    }
  }
);

router.get('/recommendations', authenticate, requireRole('jobseeker'), async (req, res) => {
  try {
    const latest = await prisma.resumeAnalysis.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!latest) {
      return res.json({ hasResume: false, jobs: [] });
    }

    let userSkills = [];
    try {
      const parsed = JSON.parse(latest.skills || '[]');
      if (Array.isArray(parsed)) {
        userSkills = parsed
          .map((s) => String(s || '').toLowerCase().trim())
          .filter(Boolean);
      }
    } catch {}

    if (userSkills.length === 0) {
      return res.json({ hasResume: true, jobs: [] });
    }

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { applications: true } } },
    });

    const scored = jobs
      .map((job) => {
        const required = (job.skills || '')
          .split(',')
          .map((s) => s.toLowerCase().trim())
          .filter(Boolean);
        if (required.length === 0) {
          return { ...job, compatibility: 0, matchedSkills: [] };
        }
        const matchedSkills = required.filter((req) =>
          userSkills.some((u) => u === req || u.includes(req) || req.includes(u))
        );
        const compatibility = Math.round((matchedSkills.length / required.length) * 100);
        return { ...job, compatibility, matchedSkills };
      })
      .filter((j) => j.compatibility > 0)
      .sort((a, b) => b.compatibility - a.compatibility);

    res.json({ hasResume: true, jobs: scored });
  } catch (err) {
    console.error('[recommendations] failed:', err);
    res.status(500).json({ error: 'Failed to load recommendations' });
  }
});

router.get('/me', authenticate, requireRole('jobseeker'), async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      where: { userId: req.user.id },
      orderBy: { appliedAt: 'desc' },
      include: { job: true, analysis: true },
    });
    const decoded = apps.map((a) => ({
      ...a,
      analysis: a.analysis
        ? {
            ...a.analysis,
            skills: safeParse(a.analysis.skills),
            missing: safeParse(a.analysis.missing),
            suggestions: safeParse(a.analysis.suggestions),
          }
        : null,
    }));
    res.json(decoded);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.get('/job/:jobId', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.recruiterId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const apps = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        analysis: true,
      },
    });

    const ranked = apps
      .map((a) => ({
        ...a,
        analysis: a.analysis
          ? {
              ...a.analysis,
              skills: safeParse(a.analysis.skills),
              missing: safeParse(a.analysis.missing),
              suggestions: safeParse(a.analysis.suggestions),
            }
          : null,
      }))
      .sort((x, y) => (y.analysis?.score || 0) - (x.analysis?.score || 0));

    res.json({ job, applications: ranked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.patch('/:id/status', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const { status } = req.body || {};
    const allowed = ['pending', 'accepted', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    }

    const app = await prisma.application.findUnique({
      where: { id },
      include: { job: { select: { recruiterId: true } } },
    });
    if (!app) return res.status(404).json({ error: 'Application not found' });
    if (app.job.recruiterId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    console.error('[status] failed:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.delete('/:id', authenticate, requireRole('jobseeker'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const app = await prisma.application.findUnique({ where: { id } });
    if (!app) return res.status(404).json({ error: 'Application not found' });
    if (app.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    // Cascade-deletes the linked ResumeAnalysis automatically.
    await prisma.application.delete({ where: { id } });

    if (app.resumePath) {
      const filePath = path.join(uploadsDir, app.resumePath);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('[withdraw] failed to remove resume file:', e.message);
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('[withdraw] failed:', err);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

router.get('/resume/:filename', authenticate, async (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
    const app = await prisma.application.findFirst({
      where: { resumePath: req.params.filename },
      include: { job: true },
    });
    if (!app) return res.status(404).json({ error: 'Not found' });
    const isOwner = app.userId === req.user.id;
    const isRecruiter = app.job.recruiterId === req.user.id;
    if (!isOwner && !isRecruiter) return res.status(403).json({ error: 'Forbidden' });
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
});

function safeParse(s) {
  try { return JSON.parse(s); } catch { return []; }
}

module.exports = router;
