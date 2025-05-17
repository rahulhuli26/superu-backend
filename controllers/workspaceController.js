const axios = require('axios');
const cheerio = require('cheerio');
const { createPage } = require('../models/pageModel');

exports.scrapeWebsite = async (req, res) => {
  const { url } = req.body;
  const userId = req.headers.userid;
  try {
    const { data } = await axios.get(url);
    const scappedData = cheerio.load(data);
    const content = scappedData('body').html(); // or $('article').html()

    if (!content) {
      return res.status(404).json({ message: 'No content found' });
    }

    createPage(url, content, userId, (err) => {
      if (err) return res.status(500).send(err);
      res.json({ success: true, url });
    });
  } catch (err) {
    res.status(500).send('Scraping failed');
  }
};