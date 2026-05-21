const express = require('express');
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { location, type, skills, search } = req.query;

    const where = {};
    if (location && location !== 'all') where.location = { contains: location, mode: 'insensitive' };
    if (type && type !== 'all') where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (skills) {
      where.skills = { contains: skills, mode: 'insensitive' };
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        recruiter: { select: { id: true, name: true } },
        _count: { select: { applications: true } },
      },
    });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        recruiter: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
    });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.post('/', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const { title, company, location, type, salary, description, requirements, skills } = req.body;
    if (!title || !company || !location || !type || !description || !requirements || !skills) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const job = await prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salary: salary || null,
        description,
        requirements,
        skills,
        recruiterId: req.user.id,
      },
    });
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.delete('/:id', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.recruiterId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await prisma.job.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

router.get('/recruiter/analytics', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user.id },
      include: {
        applications: {
          include: {
            analysis: { select: { score: true } },
            user: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const allApps = jobs.flatMap((j) => j.applications);
    const statusBreakdown = { pending: 0, accepted: 0, rejected: 0 };
    for (const a of allApps) {
      const s = a.status || 'pending';
      if (statusBreakdown[s] !== undefined) statusBreakdown[s]++;
    }

    let highest = null;
    for (const a of allApps) {
      const score = a.analysis?.score ?? 0;
      if (!highest || score > highest.score) {
        highest = { name: a.user?.name || 'Unknown', score };
      }
    }

    const allScores = allApps
      .map((a) => a.analysis?.score)
      .filter((s) => typeof s === 'number');
    const avgScore = allScores.length
      ? Math.round(allScores.reduce((s, n) => s + n, 0) / allScores.length)
      : 0;

    const perJob = jobs.map((j) => {
      const scores = j.applications
        .map((a) => a.analysis?.score)
        .filter((s) => typeof s === 'number');
      const avg = scores.length
        ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
        : 0;
      const top = scores.length ? Math.max(...scores) : 0;
      const title = j.title.length > 22 ? j.title.slice(0, 22) + '…' : j.title;
      return {
        id: j.id,
        title,
        fullTitle: j.title,
        applicants: j.applications.length,
        avgScore: avg,
        topScore: top,
      };
    });

    res.json({
      totalJobs: jobs.length,
      totalApplicants: allApps.length,
      avgScore,
      highest,
      perJob,
      statusBreakdown,
    });
  } catch (err) {
    console.error('[analytics] failed:', err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

router.get('/recruiter/mine', authenticate, requireRole('recruiter'), async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
