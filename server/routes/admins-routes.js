const express = require("express");
const { check } = require("express-validator");

const adminsController = require("../controllers/admins-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin");

const router = express.Router();

router.get("/users", adminsController.getUsers);

router.get("/users/:uid", adminsController.getUserById);

router.get("/footballers", adminsController.getFootballers);

router.get("/footballers/:fid", adminsController.getFootballerById);

router.get("/footballers/user/:uid", adminsController.getFootballersByUserId);

router.get("/transfers", adminsController.getTransfers);

router.get("/clubs", adminsController.getClubs);

router.get("/clubs/:cid", adminsController.getClubById);

router.get("/agents", adminsController.getAgents)

router.get("/agents/:aid", adminsController.getAgentById);

router.get("/news", adminsController.getNews)

router.get("/news/:nid", adminsController.getNewById);

router.use(checkAuth);

router.use(checkAdmin);

router.post(
  "/footballers/new",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("nationality").not().isEmpty(),
    check("weight").not().isEmpty(),
    check("height").not().isEmpty(),
    check("age").not().isEmpty(),
    check("foot").not().isEmpty(),
    check("placeOfBirth").not().isEmpty(),
    check("mainPosition").not().isEmpty(),
    check("additionalPosition").not().isEmpty(),
    check("cost").not().isEmpty(),
  ],
  adminsController.createFootballer
);

router.patch(
  "/footballers/:fid",
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("nationality").not().isEmpty(),
    check("weight").not().isEmpty(),
    check("height").not().isEmpty(),
    check("age").not().isEmpty(),
    check("foot").not().isEmpty(),
    check("placeOfBirth").not().isEmpty(),
    check("mainPosition").not().isEmpty(),
    check("additionalPosition").not().isEmpty(),
    check("cost").not().isEmpty(),
  ],
  adminsController.updateFootballer
);

router.delete("/footballers/:fid", adminsController.deleteFootballer);

router.post(
  "/transfers/new",
  [
    check("transferFee").not().isEmpty(),
    check("season").not().isEmpty(),
    check("compensationAmount").not().isEmpty(),
  ],
  adminsController.createTransfer
);

router.patch(
  "/transfers/:tid",
  [
    check("transferFee").not().isEmpty(),
    check("season").not().isEmpty(),
    check("compensationAmount").not().isEmpty(),
  ],
  adminsController.updateTransfer
);

router.delete("/transfers/:tid", adminsController.deleteTransfer);

router.post(
  "/clubs/new/footballer/:fid",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("country").not().isEmpty(),
    check("description").not().isEmpty(),
    check("cost").not().isEmpty(),
    check("foundationYear").not().isEmpty(),
  ],
  adminsController.createClub
);

router.patch(
  "/clubs/:cid",
  [
    check("name").not().isEmpty(),
    check("country").not().isEmpty(),
    check("description").not().isEmpty(),
    check("cost").not().isEmpty(),
    check("foundationYear").not().isEmpty(),
  ],
  adminsController.updateClub
);

router.delete("/clubs/:cid", adminsController.deleteClub);

router.post(
  "/agents/new",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("country").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phoneNumber").custom((value) => {
      const phoneRegExp = /^\+\d{1,3}-\d{1,4}-\d{1,4}-\d{4}$/;
      if (!phoneRegExp.test(value)) {
        throw new Error("Invalid phone number format.");
      }
      return true;
    }),
    check("description").not().isEmpty(),
  ],
  adminsController.createAgent
);

router.patch(
  "/agents/:aid",
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("country").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("phoneNumber").custom((value) => {
      const phoneRegExp = /^\+\d{1,3}-\d{1,4}-\d{1,4}-\d{4}$/;
      if (!phoneRegExp.test(value)) {
        throw new Error("Invalid phone number format.");
      }
      return true;
    }),
    check("description").not().isEmpty(),
  ],
  adminsController.updateAgent
);

router.delete("/agents/:aid", adminsController.deleteAgent);

router.post(
  "/news/new",
  fileUpload.single("image"),
  [check("title").not().isEmpty(), check("description").not().isEmpty()],
  adminsController.createNew
);

router.patch(
  "/news/:nid",
  [check("title").not().isEmpty(), check("description").not().isEmpty()],
  adminsController.updateNew
);

router.delete("/news/:nid", adminsController.deleteNew);

router.patch(
  "/users/:uid",
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
  ],
  adminsController.updateUser
);

router.delete("/users/:uid", adminsController.deleteUser);

module.exports = router;
