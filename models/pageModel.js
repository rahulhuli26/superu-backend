const db = require('./db');

// CREATE a page
exports.createPage = async (url, content, userId) => {
  const [result] = await db.query(
    'INSERT INTO pages (url, scrapedData, user_id) VALUES (?, ?, ?)',
    [url, content, userId]
  );
  return result.insertId; // Return inserted page ID
};

// GET all pages by user
exports.getPageData = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM pages WHERE user_id = ?',
    [userId]
  );
  return rows;
};

// UPDATE a page's content
exports.updateData = async (id, content) => {
  const [result] = await db.query(
    'UPDATE pages SET scrapedData = ? WHERE id = ?',
    [content, id]
  );
  return result.affectedRows;
};

// GET a page by ID
exports.getData = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM pages WHERE id = ?',
    [id]
  );
  return rows[0]; // Return single page
};
