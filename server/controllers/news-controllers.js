const New = require("../models/new");

const getNews = async (req, res, next) => {
  let news;
  try {
    news = await New.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching news failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    news: news.map((n) => n.toObject({ getters: true })),
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

exports.getNews = getNews;
exports.getNewById = getNewById;
