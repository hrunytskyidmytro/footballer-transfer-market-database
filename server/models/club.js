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
  },
  foundationYear: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Club", clubSchema);
