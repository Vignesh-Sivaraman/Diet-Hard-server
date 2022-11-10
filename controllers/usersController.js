const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifymail = require("../config/verifymail");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ useremail: email }).exec();
    if (userExists)
      return res.status(401).json({ message: "Email Already exists" });
    let salt = await bcrypt.genSalt(Number(process.env.SALT));
    let hash = await bcrypt.hash(password, salt);
    let nameHash = await bcrypt.hash(email, salt);
    let verifySalt = await bcrypt.genSalt(Number(process.env.SALT));
    let hashID = jwt.sign({ _id: nameHash }, process.env.SECRETNAMEKEY, {
      expiresIn: "2 days",
    });
    let verifytoken = jwt.sign(
      { _id: verifySalt },
      process.env.SECRETEMAILKEY,
      {
        expiresIn: "2 days",
      }
    );
    const result = await User.create({
      useremail: email,
      userpassword: hash,
      userverified: false,
      userhashID: hashID,
      usertoken: verifytoken,
    });
    const getentry = await User.findById(result._id).exec();
    const verifyurl = `${process.env.BASE_URL}/${getentry.userhashID}/verify/${getentry.usertoken}`;
    await verifymail(
      email,
      "Verify Email",
      `Hi I am form Pizza Lair,\n Please Click the below link to verify Your email \n ${verifyurl}`
    );
    res.status(200).json({ message: "An email sent to your mail id" });
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

module.exports = {
  register,
};
