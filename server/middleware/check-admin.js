const HttpError = require("../models/http-error");

const User = require("../models/user");

const checkAdmin = async (req, res, next) => {
  const userId = req.userData.userId;

  let user;
  try {
    user = await User.findById(userId);

    if (!user) {
      const error = new HttpError("Could not find user for provided id.", 404);
      return next(error);
    }

    if (user.role !== "admin" && user.role !== "football_manager") {
      const error = new HttpError(
        "Permission denied. Only admins can add, edit or delete.",
        403
      );
      return next(error);
    }

    next();
  } catch (err) {}
};

module.exports = checkAdmin;
