const express = require('express');
const { scrapeWebsite, scrapeWebsiteList, getScrapedData, updateScrapeData } = require('../controllers/workspaceController');
const router = express.Router();
router.post('/scrape', scrapeWebsite);
router.get('/scrapedWebsiteList', scrapeWebsiteList);
const db = require('../models/db');

router.post("/save-scraped-content", async (req, res) => {
  const { contentId, files } = req.body;
  console.log('--------10-->', contentId, Array.isArray(files));
  if (!contentId || !Array.isArray(files)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const insertQuery = `
    INSERT INTO structured_content (content_id, path, type, html, parent_id, name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  try {
    const insertPromises = files.map((file) =>{
      console.log('------->', file);
      db.query(insertQuery, [
        contentId,
        file.path,
        file.type,
        file.html || null,
        file.parent_id || null,
        file.name,
      ])}
    );

    await Promise.all(insertPromises);

    res.status(200).json({ message: "Scraped content saved" });
  } catch (err) {
    console.error("Save content failed:", err);
    res.status(500).json({ message: "Failed to save content" });
  }
});

// GET /workspace/structured-content/:id
router.get("/structured-content/:id", async (req, res) => {
  const contentId = req.params.id;

  try {
    const [files] = await db.query(
      "SELECT * FROM structured_content WHERE content_id = ?",
      [contentId]
    );
    res.status(200).json(files);
  } catch (err) {
    console.error("Fetch content failed:", err);
    res.status(500).json({ message: "Failed to fetch content" });
  }
});

// PUT /workspace/update-content
router.put("/update-content", async (req, res) => {
  const { fileId, html } = req.body;

  if (!fileId || html === undefined) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  try {
    const [result] = await db.query(
      "UPDATE structured_content SET html = ? WHERE id = ?",
      [html, fileId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({ message: "Content updated" });
  } catch (err) {
    console.error("Update content failed:", err);
    res.status(500).json({ message: "Failed to update content" });
  }
});



module.exports = router;