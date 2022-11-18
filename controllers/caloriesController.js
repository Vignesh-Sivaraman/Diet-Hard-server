const Calorie = require("../models/Calorie");
const User = require("../models/User");

const addentry = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    if (userExists) {
      const result = await Calorie.create({
        userEmail: req.body.email,
        date: req.body.entryDate,
        mealType: req.body.mealType,
        mealTitle: req.body.mealTitle,
        calories: req.body.calories,
        fat: req.body.fat,
        protein: req.body.protein,
        carbohydrates: req.body.carbohydrates,
      });
      res.status(200).json({ message: `calories data added successfully` });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const getcaloriebydate = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    console.log(req.body);
    if (userExists) {
      const dailyData = await Calorie.find({
        userEmail: req.body.email,
        date: req.body.presentDate,
      }).exec();
      dailyTotalcal = dailyData.reduce(
        (acc, item) => acc + parseInt(item.calories),
        0
      );
      dailyRemainingCal = parseInt(userExists.userCalories) - dailyTotalcal;
      dailyRemainingCal = dailyRemainingCal > 0 ? dailyRemainingCal : 0;
      let { userCalories } = userExists;
      res.status(200).json({ dailyRemainingCal, userCalories });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

module.exports = {
  addentry,
  getcaloriebydate,
};
