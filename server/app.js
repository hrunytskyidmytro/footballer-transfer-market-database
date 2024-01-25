const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const footballersRoutes = require("./routes/footballers-routes");
const usersRoutes = require("./routes/users-routes");
const transfersRoutes = require("./routes/transfers-routes");
const clubsRoutes = require("./routes/clubs-routes");
const adminsRoutes = require("./routes/admins-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/footballers", footballersRoutes); // => /api/footballers...

app.use("/api/users", usersRoutes); // => /api/users...

app.use("/api/transfers", transfersRoutes); // => /api/transfers...

app.use("/api/clubs", clubsRoutes); // => /api/clubs...

app.use("/api/admins", adminsRoutes); // => /api/admins...

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  console.log("Error details:", error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@sandbox.itlcrlu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5001, () => {
      console.log("Server is running!");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
