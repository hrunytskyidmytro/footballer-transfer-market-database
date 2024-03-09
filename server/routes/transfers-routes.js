const express = require("express");
const { check } = require("express-validator");

const transfersController = require("../controllers/transfers-controllers");

const router = express.Router();

router.get("/", transfersController.getTransfers);

router.get("/:tid", transfersController.getTransferById);

router.get("/footballer/:fid", transfersController.getTransfersByFootballer);

module.exports = router;
