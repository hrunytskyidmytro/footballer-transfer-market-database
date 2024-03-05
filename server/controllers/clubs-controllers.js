const HttpError = require("../models/http-error");
const Club = require("../models/club");

const getClubs = async (req, res, next) => {
  let clubs;
  let totalItems;
  let totalPages;
  const searchTerm = req.query.search;
  const sortBy = req.query.sortBy || "name";
  const sortDir = req.query.sortDir || "asc";
  const country = req.query.country;
  const yearFrom = req.query.yearFrom;
  const yearTo = req.query.yearTo;
  const costFrom = req.query.costFrom;
  const costTo = req.query.costTo;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    let query = {};

    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" };
    }

    if (country) {
      query.country = country;
    }

    if (yearFrom && yearTo) {
      query.foundationYear = { $gte: yearFrom, $lte: yearTo };
    } else if (yearFrom) {
      query.foundationYear = { $gte: yearFrom };
    } else if (yearTo) {
      query.foundationYear = { $lte: yearTo };
    }

    if (costFrom && costTo) {
      query.cost = { $gte: costFrom, $lte: costTo };
    } else if (costFrom) {
      query.cost = { $gte: costFrom };
    } else if (costTo) {
      query.cost = { $lte: costTo };
    }

    totalItems = await Club.countDocuments(query);
    totalPages = Math.ceil(totalItems / pageSize);

    clubs = await Club.find(query)
      .sort({ [sortBy]: sortDir === "desc" ? -1 : 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Fetching clubs failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    clubs: clubs.map((club) => club.toObject({ getters: true })),
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  });
};

const getClubById = async (req, res, next) => {
  const clubId = req.params.cid;

  let club;
  try {
    club = await Club.findById(clubId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a club.",
      500
    );
    return next(error);
  }

  if (!club) {
    const error = new HttpError(
      "Could not find a club for the provided id.",
      404
    );
    return next(error);
  }

  res.send({ club: club.toObject({ getters: true }) });
};

exports.getClubs = getClubs;
exports.getClubById = getClubById;
