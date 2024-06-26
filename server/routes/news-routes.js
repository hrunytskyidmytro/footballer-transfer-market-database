const express = require("express");

const newsController = require("../controllers/news-controllers");

const router = express.Router();

router.get("/latest", newsController.getLatestNews);

router.get("/", newsController.getNews);

router.get("/:nid", newsController.getNewById);

module.exports = router;
