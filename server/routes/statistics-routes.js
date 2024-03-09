const express = require("express");

const statisticsController = require("../controllers/statistics-controllers");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", statisticsController.getTransfersStatistics);

router.use(checkAuth);

module.exports = router;
