const express = require('express');
const db = require('../models/db');
const router = express.Router();

// GET content by file ID
router.get('/content/:fileId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM structured_content WHERE id = ?', [req.params.fileId]);
    if (rows.length === 0) return res.status(404).json({ message: 'File not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update content
router.put('/content/:fileId', async (req, res) => {
  const { html } = req.body;
  try {
    await db.query('UPDATE structured_content SET html = ? WHERE id = ?', [html, req.params.fileId]);
    res.json({ message: 'Content updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update' });
  }
});

module.exports = router;
