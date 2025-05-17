const db = require('./db');

exports.createPage = (url, content, userId, cb) => {
  db.query('INSERT INTO pages (url, scrapedData, user_id) VALUES (?, ?, ?)', [url, content, userId], cb);
};

exports.updatePageContent = (uuid, content, cb) => {
  db.query('UPDATE pages SET content = ? WHERE uuid = ?', [content, uuid], cb);
};