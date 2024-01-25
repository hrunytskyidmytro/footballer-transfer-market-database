const express = require("express");
const { check } = require("express-validator");

const footballersController = require("../controllers/footballers-controllers");

const router = express.Router();

router.get("/:fid", footballersController.getFootballerById);

router.get("/user/:uid", footballersController.getFootballersByUserId);

router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("nationality").not().isEmpty(),
    check("position").not().isEmpty(),
  ],
  footballersController.createFootballer
);

router.patch(
  "/:fid",
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("nationality").not().isEmpty(),
    check("position").not().isEmpty(),
  ],
  footballersController.updateFootballer
);

router.delete("/:fid", footballersController.deleteFootballer);

module.exports = router;
