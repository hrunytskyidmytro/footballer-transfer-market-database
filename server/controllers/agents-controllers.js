const Agent = require("../models/agent");

const getAgents = async (req, res, next) => {
  let agents;
  try {
    agents = await Agent.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching agents failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    agents: agents.map((agent) => agent.toObject({ getters: true })),
  });
};

const getAgentById = async (req, res, next) => {
  const agentId = req.params.aid;

  let agent;
  try {
    agent = await Agent.findById(agentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a agent.",
      500
    );
    return next(error);
  }

  if (!agent) {
    const error = new HttpError(
      "Could not find a agent for the provided id.",
      404
    );
    return next(error);
  }

  res.send({ agent: agent.toObject({ getters: true }) });
};

exports.getAgents = getAgents;
exports.getAgentById = getAgentById;
