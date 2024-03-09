const HttpError = require("../models/http-error");
const Agent = require("../models/agent");

const getAgents = async (req, res, next) => {
  let agents;
  let totalItems;
  let totalPages;
  const searchTerm = req.query.search;
  const sortBy = req.query.sortBy || "name";
  const sortDir = req.query.sortDir || "asc";
  const country = req.query.country;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    let query = {};

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { surname: { $regex: searchTerm, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$name", " ", "$surname"] },
              regex: searchTerm,
              options: "i",
            },
          },
        },
      ];
    }

    if (country) {
      query.country = country;
    }

    totalItems = await Agent.countDocuments(query);
    totalPages = Math.ceil(totalItems / pageSize);

    agents = await Agent.find(query)
      .sort({ [sortBy]: sortDir === "desc" ? -1 : 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  } catch (err) {
    const error = new HttpError(
      "Fetching agents failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    agents: agents.map((agent) => agent.toObject({ getters: true })),
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
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
