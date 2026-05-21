const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { chatReply } = require('../services/gemini');

router.post('/', async (req, res, next) => {
  try {
    const { message, history } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long' });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .slice(-12)
          .filter(
            (h) =>
              h &&
              (h.role === 'user' || h.role === 'assistant') &&
              typeof h.content === 'string'
          )
      : [];

    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        type: true,
        skills: true,
      },
    });

    const reply = await chatReply({ message: message.trim(), history: safeHistory, jobs });
    res.json({ reply });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
