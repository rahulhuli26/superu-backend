const express = require('express');
const { scrapeWebsite } = require('../controllers/workspaceController');
const router = express.Router();
router.post('/scrape', scrapeWebsite);
module.exports = router;