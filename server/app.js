const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const footballersRoutes = require("./routes/footballers-routes");
const usersRoutes = require("./routes/users-routes");
const transfersRoutes = require("./routes/transfers-routes");
const clubsRoutes = require("./routes/clubs-routes");
const agentsRoutes = require("./routes/agents-routes");
const newsRoutes = require("./routes/news-routes");
const ratingsRoutes = require("./routes/ratings-routes");
const statisticsRoutes = require("./routes/statistics-routes");
const adminsRoutes = require("./routes/admins-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/footballers", footballersRoutes); 

app.use("/api/users", usersRoutes); 

app.use("/api/transfers", transfersRoutes); 

app.use("/api/clubs", clubsRoutes); 

app.use("/api/agents", agentsRoutes); 

app.use("/api/news", newsRoutes); 

app.use("/api/ratings", ratingsRoutes); 

app.use("/api/statistics", statisticsRoutes); 

app.use("/api/admins", adminsRoutes); 

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
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
