const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 100000,
    max: 10000000000,
  },
  foundationYear: {
    type: Number,
    required: true,
    min: 1800,
    max: 2024,
  },
});

module.exports = mongoose.model("Club", clubSchema);
