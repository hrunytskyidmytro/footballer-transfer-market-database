const HttpError = require("../models/http-error");
const Footballer = require("../models/footballer");
const User = require("../models/user");
const Club = require("../models/club");
const Rating = require("../models/rating");

const getFootballers = async (req, res, next) => {
  let footballers;
  let totalItems;
  let totalPages;
  const searchTerm = req.query.search;
  const sortBy = req.query.sortBy || "name";
  const sortDir = req.query.sortDir || "asc";
  const foot = req.query.foot;
  const nationality = req.query.nationality;
  const mainPosition = req.query.mainPosition;
  const weightFrom = req.query.weightFrom;
  const weightTo = req.query.weightTo;
  const heightFrom = req.query.heightFrom;
  const heightTo = req.query.heightTo;
  const ageFrom = req.query.ageFrom;
  const ageTo = req.query.ageTo;
  const costFrom = req.query.costFrom;
  const costTo = req.query.costTo;
  const club = req.query.club;
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

    if (foot) {
      query.foot = foot;
    }

    if (nationality) {
      query.nationality = nationality;
    }

    if (mainPosition) {
      query.mainPosition = mainPosition;
    }

    if (weightFrom && weightTo) {
      query.weight = { $gte: weightFrom, $lte: weightTo };
    } else if (weightFrom) {
      query.weight = { $gte: weightFrom };
    } else if (weightTo) {
      query.weight = { $lte: weightTo };
    }

    if (heightFrom && heightTo) {
      query.height = { $gte: heightFrom, $lte: heightTo };
    } else if (heightFrom) {
      query.height = { $gte: heightFrom };
    } else if (heightTo) {
      query.height = { $lte: heightTo };
    }

    if (ageFrom && ageTo) {
      query.age = { $gte: ageFrom, $lte: ageTo };
    } else if (ageFrom) {
      query.age = { $gte: ageFrom };
    } else if (ageTo) {
      query.age = { $lte: ageTo };
    }

    if (costFrom && costTo) {
      query.cost = { $gte: costFrom, $lte: costTo };
    } else if (costFrom) {
      query.cost = { $gte: costFrom };
    } else if (costTo) {
      query.cost = { $lte: costTo };
    }

    if (club) {
      const clubObj = await Club.findOne({ name: club });
      if (!clubObj) {
        const error = new HttpError("Club not found.", 404);
        return next(error);
      }
      query.club = clubObj._id;
    }

    totalItems = await Footballer.countDocuments(query);
    totalPages = Math.ceil(totalItems / pageSize);

    footballers = await Footballer.find(query)
      .sort({ [sortBy]: sortDir === "desc" ? -1 : 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("agent")
      .populate("club");
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Fetching footballers failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    footballers: footballers.map((footballer) =>
      footballer.toObject({ getters: true })
    ),
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  });
};

const getFootballerById = async (req, res, next) => {
  const footballerId = req.params.fid;

  let footballer;
  try {
    footballer = await Footballer.findById(footballerId)
      .populate("agent")
      .populate("club");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a footballer.",
      500
    );
    return next(error);
  }

  if (!footballer) {
    const error = new HttpError(
      "Could not find a footballer for the provided id.",
      404
    );
    return next(error);
  }

  res.send({
    footballer: footballer.toObject({ getters: true }),
  });
};

const getFootballersByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithFootballers;
  try {
    userWithFootballers = await User.findById(userId).populate("footballers");
  } catch (err) {
    const error = new HttpError(
      "Fetching footballers failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithFootballers || userWithFootballers.footballers.length === 0) {
    return next(
      new HttpError("Could not find footballers for the provided user id.", 404)
    );
  }

  res.json({
    footballers: userWithFootballers.footballers.map((footballer) =>
      footballer.toObject({ getters: true })
    ),
  });
};

const getMostExpensiveFootballers = async (req, res, next) => {
  let footballers;
  try {
    footballers = await Footballer.find().sort({ cost: -1 }).limit(3);
  } catch (err) {
    const error = new HttpError(
      "Fetching most expensive footballers failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    footballers: footballers.map((footballer) =>
      footballer.toObject({ getters: true })
    ),
  });
};

const getYoungestFootballers = async (req, res, next) => {
  let footballers;
  try {
    footballers = await Footballer.find().sort({ birthDate: -1 }).limit(3);
  } catch (err) {
    const error = new HttpError(
      "Fetching youngest footballers failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    footballers: footballers.map((footballer) =>
      footballer.toObject({ getters: true })
    ),
  });
};

const getOldestFootballers = async (req, res, next) => {
  let footballers;
  try {
    footballers = await Footballer.find().sort({ birthDate: 1 }).limit(3);
  } catch (err) {
    const error = new HttpError(
      "Fetching youngest footballers failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    footballers: footballers.map((footballer) =>
      footballer.toObject({ getters: true })
    ),
  });
};

exports.getFootballers = getFootballers;
exports.getFootballerById = getFootballerById;
exports.getFootballersByUserId = getFootballersByUserId;
exports.getMostExpensiveFootballers = getMostExpensiveFootballers;
exports.getYoungestFootballers = getYoungestFootballers;
exports.getOldestFootballers = getOldestFootballers;
