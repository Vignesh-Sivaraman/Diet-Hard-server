const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MealPlanScehma = new Schema(
  { url: String, text: String, id: Number },
  { collection: "mealplans" }
);

module.exports = mongoose.model("Mealplan", MealPlanScehma);
