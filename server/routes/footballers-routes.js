const express = require("express");
const { check } = require("express-validator");

const footballersController = require("../controllers/footballers-controllers");

const router = express.Router();

router.get("/:fid", footballersController.getFootballerById);

module.exports = router;
