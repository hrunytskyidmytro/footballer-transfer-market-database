const express = require("express");
const { check } = require("express-validator");

const footballersController = require("../controllers/footballers-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:fid", footballersController.getFootballerById);

router.get("/user/:uid", footballersController.getFootballersByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
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
