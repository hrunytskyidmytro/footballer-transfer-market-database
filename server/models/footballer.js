const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const footballerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    default: Date.now,
  },
  position: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  clubs: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Club",
    },
  ],
  transfers: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Transfer",
    },
  ],
});

module.exports = mongoose.model("Footballer", footballerSchema);
