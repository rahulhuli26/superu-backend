const pool = require('../models/db');

exports.saveDocument = async (req, res) => {
  const { docId, content } = req.body;
  await pool.query('REPLACE INTO documents (id, content) VALUES (?, ?)', [docId, JSON.stringify(content)]);
  res.json({ success: true });
};

exports.loadDocument = async (req, res) => {
  const [rows] = await pool.query('SELECT content FROM documents WHERE id = ?', [req.params.docId]);
  if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json({ content: JSON.parse(rows[0].content) });
};
