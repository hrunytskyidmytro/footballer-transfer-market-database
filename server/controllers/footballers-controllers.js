const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

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

const createFootballer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, surname, birthDate, nationality, position } = req.body;

  let existingFootballer;
  try {
    existingFootballer = await Footballer.findOne({
      $or: [{ name }, { surname }],
    });
  } catch (err) {
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  if (existingFootballer) {
    const error = new HttpError(
      "Footballer with the same name or surname already exists.",
      422
    );
    return next(error);
  }

  const createdFootballer = new Footballer({
    name,
    surname,
    nationality,
    birthDate,
    position,
    image: req.file.path,
    creator: req.userData.userId,
    clubs: [],
    transfers: [],
  });

  console.log(req.userData);

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdFootballer.save({ session: sess });
    user.footballers.push(createdFootballer);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ footballer: createdFootballer });
};

const updateFootballer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, surname, birthDate, nationality, position } = req.body;
  const footballerId = req.params.fid;

  let footballer;
  try {
    footballer = await Footballer.findById(footballerId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update footballer.",
      500
    );
    return next(error);
  }

  if (footballer.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this footballer.",
      403
    );
    return next(error);
  }

  footballer.name = name;
  footballer.surname = surname;
  footballer.birthDate = birthDate;
  footballer.nationality = nationality;
  footballer.position = position;

  try {
    await footballer.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update footballer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ footballer: footballer.toObject({ getters: true }) });
};

const deleteFootballer = async (req, res, next) => {
  const footballerId = req.params.fid;

  let footballer;
  try {
    footballer = await Footballer.findById(footballerId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete footballer.",
      500
    );
    return next(error);
  }

  if (!footballer) {
    const error = new HttpError("Could not find footballer for this id.", 404);
    return next(error);
  }

  if (footballer.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this footballer.",
      403
    );
    return next(error);
  }

  const imagePath = footballer.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await footballer.deleteOne({ session: sess });
    footballer.creator.footballers.pull(footballer);
    await footballer.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete footballer.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted footballer." });
};

exports.getFootballers = getFootballers;
exports.getFootballerById = getFootballerById;
exports.getFootballersByUserId = getFootballersByUserId;
exports.createFootballer = createFootballer;
exports.updateFootballer = updateFootballer;
exports.deleteFootballer = deleteFootballer;
