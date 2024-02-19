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
    required: true,
    min: new Date("1950-01-01"),
    max: new Date(),
  },
  weight: {
    type: Number,
    required: true,
    min: 50,
    max: 100,
  },
  height: {
    type: Number,
    required: true,
    min: 140,
    max: 220,
  },
  age: {
    type: Number,
    required: true,
    min: 12,
    max: 60,
  },
  foot: {
    type: String,
    required: true,
  },
  agent: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "Agent",
  },
  club: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "Club",
  },
  contractUntil: {
    type: Date,
    required: true,
    min: new Date(),
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
    min: 50000,
    max: 200000000,
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
});

module.exports = mongoose.model("Footballer", footballerSchema);
