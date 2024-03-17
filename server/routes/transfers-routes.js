const express = require("express");

const transfersController = require("../controllers/transfers-controllers");

const router = express.Router();

router.get("/", transfersController.getTransfers);

router.get("/:tid", transfersController.getTransferById);

router.get("/footballer/:fid", transfersController.getTransfersByFootballer);

module.exports = router;
