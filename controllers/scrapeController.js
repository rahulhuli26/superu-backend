const axios = require('axios');
const cheerio = require('cheerio');

exports.scrape = async (req, res) => {
  const { url } = req.body;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $('title').text();
    res.json({ title, success: true });
  } catch {
    res.status(500).json({ message: 'Scraping failed' });
  }
};
