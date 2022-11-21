const Workout = require("../models/Workout");
const User = require("../models/User");

const addentry = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    if (userExists) {
      const result = await Workout.create({
        userEmail: req.body.email,
        date: req.body.entryDate,
        workoutTime: req.body.workoutTime,
      });
      res.status(200).json({ message: `Workout data added successfully` });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

module.exports = {
  addentry,
};
