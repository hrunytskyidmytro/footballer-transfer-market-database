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
    min: 50000,
    max: 200000000,
  },
  transferDate: {
    type: Date,
    required: true,
    min: new Date("2000-01-01"),
    max: new Date(),
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
    min: 50000,
    max: 5000000,
  },
  contractTransferUntil: {
    type: Date,
    required: true,
    min: new Date(),
  },
});

module.exports = mongoose.model("Transfer", transferSchema);
