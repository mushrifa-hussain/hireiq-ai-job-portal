const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');
const { generateInterviewQuestions } = require('../services/gemini');

router.post('/:jobId', authenticate, requireRole('jobseeker'), async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);
    if (Number.isNaN(jobId)) return res.status(400).json({ error: 'Invalid jobId' });

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const questions = await generateInterviewQuestions(job);
    res.json({ job: { id: job.id, title: job.title, company: job.company }, questions });
  } catch (err) {
    const msg = (err && err.message) || String(err);
    console.error('[interview] failed:', msg);
    const transient = /503|429|overloaded|high demand|unavailable|rate.?limit/i.test(msg);
    res.status(transient ? 503 : 500).json({
      error: transient
        ? 'The AI service is temporarily overloaded. Please try again in a minute.'
        : 'Could not generate interview questions.',
    });
  }
});

module.exports = router;
