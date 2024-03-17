const express = require("express");

const clubsController = require("../controllers/clubs-controllers");

const router = express.Router();

router.get("/", clubsController.getClubs);

router.get("/:cid", clubsController.getClubById);

module.exports = router;
