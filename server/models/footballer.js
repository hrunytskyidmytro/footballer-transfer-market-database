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
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  foot: {
    type: String,
    required: true,
  },
  club: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "Club",
  },
  contractUntil: {
    type: Date,
    required: true,
  },
  placeOfBirth: {
    type: String,
    required: true,
  },
  mainPosition: {
    type: String,
    required: true,
  },
  additionalPosition: {
    type: String,
    required: false,
  },
  cost: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  agent: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "Agent",
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
