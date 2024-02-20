const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user", "football_manager"],
    default: "user",
  },
  registrationDate: {
    type: Date,
    default: Date.now,
    min: "2000-01-01",
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
