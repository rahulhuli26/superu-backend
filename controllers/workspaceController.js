const axios = require("axios");
const cheerio = require("cheerio");
const {
  createPage,
  getPageData,
} = require("../models/pageModel");

exports.scrapeWebsite = async (req, res) => {
  const { url } = req.body;
  const userId = req.headers.userid;

  try {
    const { data } = await axios.get(url);
    const scappedData = cheerio.load(data);
    const content = scappedData("body").html();

    if (!content) {
      return res.status(404).json({ message: "No content found" });
    }

    const insertedId = await createPage(url, content, userId);

    res.json({ success: true, data: content, content_id: insertedId });
  } catch (err) {
    console.error("Scraping failed:", err);
    res.status(500).send("Scraping failed");
  }
};
exports.scrapeWebsiteList = async (req, res) => {
  const userId = req.headers.userid;

  try {
    const data = await getPageData(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Fetching page data failed:", err);
    res.status(500).send("Scraping failed");
  }
};