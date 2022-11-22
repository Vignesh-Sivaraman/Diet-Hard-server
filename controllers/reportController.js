const Calorie = require("../models/Calorie");
const User = require("../models/User");
const Water = require("../models/Water");
const Workout = require("../models/Workout");
const Mealplan = require("../models/Mealplan");

//  this route will return the remaining nutrients and nutrient goals, Mainly used for dashboard
const getTotalNutrientsByDate = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    if (userExists) {
      // To calculate calories
      const dailyCalorieData = await Calorie.find({
        userEmail: req.body.email,
        date: req.body.presentDate,
      }).exec();
      dailyTotalCal = dailyCalorieData.reduce(
        (acc, item) => acc + parseInt(item.calories),
        0
      );
      dailyRemainingCal = parseInt(userExists.userCalories) - dailyTotalCal;
      dailyRemainingCal = dailyRemainingCal > 0 ? dailyRemainingCal : 0;

      //   To calculate water
      const dailyWaterData = await Water.find({
        userEmail: req.body.email,
        date: req.body.presentDate,
      }).exec();
      dailyTotalWater = dailyWaterData.reduce(
        (acc, item) => acc + parseInt(item.waterQty),
        0
      );
      dailyRemainingWater = parseInt(userExists.userWater) - dailyTotalWater;
      dailyRemainingWater = dailyRemainingWater > 0 ? dailyRemainingWater : 0;

      //   To calculate workout
      const dailyWorkoutData = await Workout.find({
        userEmail: req.body.email,
        date: req.body.presentDate,
      }).exec();
      dailyTotalWorkout = dailyWorkoutData.reduce(
        (acc, item) => acc + parseInt(item.workoutTime),
        0
      );
      dailyRemainingWorkout =
        parseInt(userExists.userWorkout) - dailyTotalWorkout;
      dailyRemainingWorkout =
        dailyRemainingWorkout > 0 ? dailyRemainingWorkout : 0;

      let { userCalories, userWater, userWorkout } = userExists;
      res.status(200).json({
        dailyRemainingCal,
        dailyRemainingWater,
        dailyRemainingWorkout,
        userCalories,
        userWater,
        userWorkout,
      });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const getMealPlan = async (req, res) => {
  try {
    const mealPlanData = await Mealplan.find({}).exec();
    res.status(200).json({
      mealPlanData,
    });
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

module.exports = {
  getTotalNutrientsByDate,
  getMealPlan,
};
