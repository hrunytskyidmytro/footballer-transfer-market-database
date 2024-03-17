const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new Error(
        "Authentication failed: Authorization header is missing!"
      );
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    if (!decodedToken) {
      throw new Error("Authentication failed: Decoded token is empty!");
    }
    req.userData = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
