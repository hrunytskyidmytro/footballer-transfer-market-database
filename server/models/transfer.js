const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transferSchema = new Schema({
  footballer: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Footballer",
  },
  fromClub: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Club",
  },
  toClub: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Club",
  },
  transferFee: {
    type: Number,
    required: true,
  },
  transferDate: {
    type: Date,
    default: Date.now,
  },
  transferType: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  compensationAmount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Transfer", transferSchema);
