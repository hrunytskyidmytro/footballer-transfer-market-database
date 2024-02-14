const express = require("express");
const { check } = require("express-validator");

const agentsController = require("../controllers/agents-controllers");

const router = express.Router();

router.get("/", agentsController.getAgents);

router.get("/:aid", agentsController.getAgentById);

module.exports = router;