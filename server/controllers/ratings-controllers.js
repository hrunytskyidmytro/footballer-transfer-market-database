const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Rating = require("../models/rating");

const getRatings = async (req, res, next) => {
  let ratings;

  try {
    ratings = await Rating.find({}).populate("footballer").populate("user");
  } catch (err) {
    const error = new HttpError(
      "Fetching ratings failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!ratings || ratings.length === 0) {
    const error = new HttpError(" No ratings found for this footballer.", 404);
    return next(error);
  }

  res.json({
    ratings: ratings.map((rating) => rating.toObject({ getters: true })),
  });
};

const getRatingByUserAndFootballer = async (req, res, next) => {
  const footballerId = req.params.fid;

  let rating;
  if (req.userData) {
    const userId = req.userData.userId;
    try {
      rating = await Rating.findOne({
        user: userId,
        footballer: footballerId,
      });
    } catch (err) {
      const error = new HttpError(
        "Fetching rating failed, please try again later.",
        500
      );
      return next(error);
    }
  }

  res.json({ rating: rating ? rating.toObject({ getters: true }) : null });
};

const createRating = async (req, res, next) => {
  const { footballer, rating } = req.body;
  const userId = req.userData.userId;

  let existingRating;
  try {
    existingRating = await Rating.findOne({ user: userId, footballer });
  } catch (err) {
    const error = new HttpError(
      "Creating rating failed, please try again.",
      500
    );
    return next(error);
  }

  if (existingRating) {
    const error = new HttpError("You have already rated this footballer.", 422);
    return next(error);
  }

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
    const error = new HttpError(
      "Something went wrong, could not delete rating.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted rating." });
};

const getAverageRatingByFootballerId = async (req, res, next) => {
  const footballerId = req.params.fid;

  let ratings;
  try {
    ratings = await Rating.find({ footballer: footballerId });
  } catch (err) {
    const error = new HttpError(
      "Fetching ratings failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!ratings || ratings.length === 0) {
    return res.json({ averageRating: 0 });
  }

  const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = totalRating / ratings.length;

  res.json({ averageRating });
};

exports.getRatings = getRatings;
exports.getRatingByUserAndFootballer = getRatingByUserAndFootballer;
exports.createRating = createRating;
exports.updateRating = updateRating;
exports.deleteRating = deleteRating;
exports.getAverageRatingByFootballerId = getAverageRatingByFootballerId;
