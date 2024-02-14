const express = require("express");
const { check } = require("express-validator");

const newsController = require("../controllers/news-controllers");

const router = express.Router();

router.get("/", newsController.getNews);

router.get("/:nid", newsController.getNewById);

module.exports = router;