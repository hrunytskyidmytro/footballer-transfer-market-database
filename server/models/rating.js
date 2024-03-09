const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  footballer: {
    type: Schema.Types.ObjectId,
    ref: "Footballer",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now,
    min: "2000-01-01",
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
