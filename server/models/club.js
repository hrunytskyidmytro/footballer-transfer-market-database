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
    min: 0,
    max: 1000000000,
  },
  foundationYear: {
    type: Number,
    required: true,
    min: 1800,
  },
});

clubSchema.index({ name: 1 });

module.exports = mongoose.model("Club", clubSchema);
