const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calorieSchema = new Schema({
  userEmail: String,
  date: String,
  mealType: String,
  mealTitle: String,
  calories: String,
  fat: String,
  protein: String,
  carbohydrates: String,
});

module.exports = mongoose.model("Calorie", calorieSchema);
