const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userEmail: String,
  userPassword: String,
  userType: String,
  userVerified: Boolean,
  userHashID: String,
  userToken: String,
  userPassID: String,
  userPassToken: String,
  userPassStatus: Boolean,
  userName: String,
  userDob: String,
  userWeight: String,
  userTargetWeight: String,
  userCalories: String,
  userVeg: String,
  userDetailsReceived: Boolean,
});

module.exports = mongoose.model("User", userSchema);
