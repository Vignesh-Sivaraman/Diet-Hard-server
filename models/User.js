const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userEmail: String,
  userPassword: String,
  createdDate: String,
  userType: String,
  userVerified: Boolean,
  userHashID: String,
  userToken: String,
  userPassID: String,
  userPassToken: String,
  userPassStatus: Boolean,
  userName: String,
  userDob: String,
  userWeight: Number,
  userTargetWeight: Number,
  userCalories: Number,
  userWater: Number,
  userWorkout: Number,
  userDetailsReceived: Boolean,
  userCalorieStreak: Number,
  userWaterStreak: Number,
  userWorkoutStreak: Number,
});

module.exports = mongoose.model("User", userSchema);
