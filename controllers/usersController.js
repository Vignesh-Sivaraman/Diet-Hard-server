const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifymail = require("../config/verifymail");

const register = async (req, res) => {
  try {
    const { email, password, createdDate } = req.body;
    const userExists = await User.findOne({ userEmail: email }).exec();
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
      userEmail: email,
      userPassword: hash,
      userVerified: false,
      createdDate,
      userHashID: hashID,
      userToken: verifytoken,
      userDetailsReceived: false,
      userCalorieStreak: 0,
      userWaterStreak: 0,
      userWorkoutStreak: 0,
    });
    const getentry = await User.findById(result._id).exec();
    const verifyurl = `${process.env.BASE_URL}/${getentry.userHashID}/verify/${getentry.userToken}`;
    await verifymail(
      email,
      "Verify Email",
      `Hi I am form Diet Hard,\n Please Click the below link to verify Your email \n ${verifyurl}`
    );
    res.status(200).json({ message: "An email sent to your mail id" });
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const verify = async (req, res) => {
  try {
    const dataToVerify = await User.findOne({
      userHashID: req.params.id,
      userToken: req.params.token,
    }).exec();
    if (!dataToVerify) return res.status(400).json({ message: "invalid link" });
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $set: { userVerified: true, userHashID: "", userToken: "" } }
    );
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $unset: { userHashID: "", userToken: "" } }
    );
    res.status(200).json({ message: "Email verified Successfully" });
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const signin = async (req, res) => {
  try {
    //getting the data from the db for the sent email
    const getUser = await User.findOne({
      userEmail: req.body.email,
    }).exec();
    // Login logic
    if (getUser) {
      let { userDetailsReceived, userEmail, userName } = getUser;
      let compare = await bcrypt.compare(
        req.body.password,
        getUser.userPassword
      );
      if (compare && getUser.userVerified) {
        let token = jwt.sign({ _id: getUser._id }, process.env.SECRET, {
          expiresIn: "30 days",
        });
        res.status(200).json({ token, userDetailsReceived, userEmail });
      } else {
        res.status(401).json({
          message:
            "password is wrong or email is not verified \n Kindly Check your Password or verify your Email",
        });
      }
    } else {
      res.status(404).json({ message: "user email not found" });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const forpass = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    if (!userExists)
      return res.status(401).json({ message: "Invalid Email ID" });
    let salt = await bcrypt.genSalt(Number(process.env.SALT));
    let nameHash = await bcrypt.hash(req.body.email, salt);
    let verifySalt = await bcrypt.genSalt(Number(process.env.SALT));
    let passID = jwt.sign({ _id: nameHash }, process.env.SECRETPASSKEY, {
      expiresIn: "2 days",
    });
    let passtoken = jwt.sign({ _id: verifySalt }, process.env.SECRETEMAILKEY, {
      expiresIn: "2 days",
    });
    const result = await User.findOneAndUpdate(
      { userEmail: req.body.email },
      {
        $set: {
          userPassID: passID,
          userPassToken: passtoken,
          userPassStatus: false,
        },
      }
    );
    const getentry = await User.findById(result._id).exec();
    const verifyurl = `${process.env.BASE_URL}/forpass/${getentry.userPassID}/verify/${getentry.userPassToken}`;
    await verifymail(
      req.body.email,
      "verify Email to reset password",
      `Hi I am form Diet Hard,\n Please Click the below link to reset Your password \n ${verifyurl}`
    );
    res.status(200).json({ message: "An email sent to your mail id" });
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const verifypass = async (req, res) => {
  try {
    const dataToVerify = await User.findOne({
      userPassID: req.params.id,
      userPassToken: req.params.token,
    }).exec();
    console.log(dataToVerify);
    if (!dataToVerify) return res.status(400).json({ message: "invalid link" });
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $set: { userPassStatus: true, userPassID: "", userPassToken: "" } }
    );
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $unset: { userPassID: "", userPassToken: "" } }
    );
    res.status(200).json({ message: "Email verified Successfully" });
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const resetpass = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    if (!userExists)
      return res.status(401).json({ message: "Invalid Email ID" });
    let salt = await bcrypt.genSalt(Number(process.env.SALT));
    let hash = await bcrypt.hash(req.body.password, salt);
    if (userExists.userPassStatus) {
      await User.findOneAndUpdate(
        { userEmail: req.body.email },
        {
          $set: {
            userPassword: hash,
          },
        }
      );
      await User.findOneAndUpdate(
        { userEmail: req.body.email },
        { $unset: { userPassStatus: "" } }
      );
      res.status(200).json({ message: "Password changed successfully" });
    } else {
      res.status(401).json({
        message:
          "Email is not verified for password reset \n Kindly verify your Email",
      });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const userdetails = async (req, res) => {
  try {
    const userExists = await User.findOne({ userEmail: req.body.email }).exec();
    if (!userExists)
      return res.status(401).json({
        message: "oops Couldn't find your account, Please contact support",
      });
    await User.findOneAndUpdate(
      { userEmail: req.body.email },
      {
        $set: {
          userName: req.body.userName,
          userDob: req.body.userDob,
          userWeight: req.body.userWeight,
          userTargetWeight: req.body.userTargetWeight,
          userCalories: req.body.userCalories,
          userVeg: req.body.userVeg,
          userDetailsReceived: true,
        },
      }
    );
    const result = await User.findOne({ userEmail: req.body.email }).exec();

    if (result) {
      const { userDetailsReceived } = result;
      res
        .status(200)
        .json({ message: "Details added Successfully", userDetailsReceived });
    }
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};
module.exports = {
  register,
  verify,
  signin,
  forpass,
  verifypass,
  resetpass,
  userdetails,
};
