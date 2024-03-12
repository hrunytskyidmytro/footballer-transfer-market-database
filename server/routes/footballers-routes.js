const express = require("express");

const footballersController = require("../controllers/footballers-controllers");

const router = express.Router();

router.get("/expensive", footballersController.getMostExpensiveFootballers);

router.get("/youngest", footballersController.getYoungestFootballers);

router.get("/oldest", footballersController.getOldestFootballers);

router.get("/", footballersController.getFootballers);

router.get("/:fid", footballersController.getFootballerById);

router.get("/user/:uid", footballersController.getFootballersByUserId);

module.exports = router;
