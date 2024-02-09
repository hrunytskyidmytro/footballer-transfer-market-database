const express = require("express");
const { check } = require("express-validator");

const adminsController = require("../controllers/admins-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin");

const router = express.Router();

router.get("/users", adminsController.getUsers);

router.get("/footballers", adminsController.getFootballers);

router.get("/footballers/:fid", adminsController.getFootballerById);

router.get("/footballers/user/:uid", adminsController.getFootballersByUserId);

router.get("/transfers", adminsController.getTransfers);

router.delete("/transfers/:tid", adminsController.deleteTransfer);

router.get("/clubs", adminsController.getClubs);

router.get("/clubs/:cid", adminsController.getClubById);

router.use(checkAuth);

router.post(
  "/footballers/new",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("nationality").not().isEmpty(),
    check("position").not().isEmpty(),
  ],
  adminsController.createFootballer
);

router.patch(
  "/footballers/:fid",
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("nationality").not().isEmpty(),
    check("position").not().isEmpty(),
  ],
  adminsController.updateFootballer
);

router.delete("/footballers/:fid", adminsController.deleteFootballer);

router.post(
  "/transfers/new",
  [check("transferFee").not().isEmpty()],
  adminsController.createTransfer
);

router.patch(
  "/transfers/:tid",
  [
    check("transferFee").not().isEmpty().isInt(),
    check("transferDate").not().isEmpty(),
    check("transferType").not().isEmpty(),
  ],
  adminsController.updateTransfer
);

router.post(
  "/clubs/new/footballer/:fid",
  [check("name").not().isEmpty(), check("country").not().isEmpty()],
  adminsController.createClub
);

router.patch(
  "/clubs/:cid",
  [check("name").not().isEmpty(), check("country").not().isEmpty()],
  adminsController.updateClub
);

router.delete("/clubs/:cid", adminsController.deleteClub);

module.exports = router;
