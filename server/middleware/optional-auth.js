const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    console.log(authorizationHeader);
    if (authorizationHeader) {
      const token = authorizationHeader.split(" ")[1];
      console.log(token);
      if (token) {
        const decodedToken = jwt.verify(token, "supersecret_dont_share");
        console.log(decodedToken);
        if (decodedToken) {
          req.userData = {
            userId: decodedToken.userId,
            role: decodedToken.role,
          };
        }
      }
    }
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
