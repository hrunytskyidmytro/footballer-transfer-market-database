const express = require("express");

const ratingsController = require("../controllers/ratings-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", ratingsController.getRatings);

router.get("/:fid/average", ratingsController.getAverageRatingByFootballerId);

router.use(checkAuth);

router.get("/:fid", ratingsController.getRatingByUserAndFootballer);

router.post("/new", ratingsController.createRating);

router.patch("/:rid", ratingsController.updateRating);

router.delete("/:rid", ratingsController.deleteRating);

module.exports = router;
