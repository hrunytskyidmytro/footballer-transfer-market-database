const HttpError = require("../models/http-error");
const New = require("../models/new");

const getNews = async (req, res, next) => {
  let news;
  let totalItems;
  let totalPages;
  const searchTerm = req.query.search;
  const sortBy = req.query.sortBy || "title";
  const sortDir = req.query.sortDir || "asc";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  try {
    let query = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: "i" };
    }

    totalItems = await New.countDocuments(query);
    totalPages = Math.ceil(totalItems / pageSize);

    news = await New.find(query)
      .sort({ [sortBy]: sortDir === "desc" ? -1 : 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
  } catch (err) {
    const error = new HttpError(
      "Fetching news failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    news: news.map((n) => n.toObject({ getters: true })),
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  });
};

const getNewById = async (req, res, next) => {
  const newId = req.params.nid;

  let n;
  try {
    n = await New.findById(newId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a new.",
      500
    );
    return next(error);
  }

  if (!n) {
    const error = new HttpError(
      "Could not find a new for the provided id.",
      404
    );
    return next(error);
  }

  res.send({ n: n.toObject({ getters: true }) });
};

const getLatestNews = async (req, res, next) => {
  let news;
  try {
    news = await New.find().sort({ date: -1 }).limit(3);
  } catch (err) {
    const error = new HttpError(
      "Fetching latest news failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    news: news.map((n) => n.toObject({ getters: true })),
  });
};

exports.getNews = getNews;
exports.getNewById = getNewById;
exports.getLatestNews = getLatestNews;
