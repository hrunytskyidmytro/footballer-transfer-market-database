const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Rating = require("../models/rating");
const Footballer = require("../models/footballer");
const User = require("../models/user");

const createRating = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { footballer, rating } = req.body;

  const createdRating = new Rating({
    footballer,
    user: req.userData.userId,
    rating,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdRating.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating rating failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ rating: createdRating });
};

const updateRating = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { rating } = req.body;
  const ratingId = req.params.rid;

  let r;
  try {
    r = await Rating.findById(ratingId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update rating.",
      500
    );
    return next(error);
  }

  r.rating = rating;

  try {
    await r.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update rating.",
      500
    );
    return next(error);
  }

  res.status(200).json({ rating: r.toObject({ getters: true }) });
};

const deleteRating = async (req, res, next) => {
  const ratingId = req.params.rid;

  let r;
  try {
    r = await Rating.findById(ratingId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete rating.",
      500
    );
    return next(error);
  }

  if (!r) {
    const error = new HttpError("Could not find rating for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await r.deleteOne({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete rating.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted rating." });
};

exports.createRating = createRating;
exports.updateRating = updateRating;
exports.deleteRating = deleteRating;
