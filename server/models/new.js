const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    min: new Date("2000-01-01"),
    max: new Date(),
  },
  image: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("News", newsSchema);
