const Water = require("../models/Water");
const User = require("../models/User");

const addentry = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    if (userExists) {
      const result = await Water.create({
        userEmail: req.body.email,
        date: req.body.entryDate,
        waterQty: req.body.waterQty,
      });
      res.status(200).json({ message: `Water data added successfully` });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

module.exports = {
  addentry,
};
