const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calorieSchema = new Schema({
  userEmail: String,
  date: String,
  mealType: String,
  mealTitle: String,
  calories: Number,
  fat: Number,
  protein: Number,
  carbohydrates: Number,
});

module.exports = mongoose.model("Calorie", calorieSchema);
