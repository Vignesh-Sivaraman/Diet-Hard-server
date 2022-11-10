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
      userhashID: req.params.id,
      usertoken: req.params.token,
    }).exec();
    if (!dataToVerify) return res.status(400).json({ message: "invalid link" });
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $set: { userverified: true, userhashID: "", usertoken: "" } }
    );
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $unset: { userhashID: "", usertoken: "" } }
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
      useremail: req.body.email,
    }).exec();
    // Login logic
    if (getUser) {
      let email = getUser.email;
      let compare = await bcrypt.compare(
        req.body.password,
        getUser.userpassword
      );
      if (compare && getUser.userverified) {
        let token = jwt.sign({ _id: getUser._id }, process.env.SECRET, {
          expiresIn: "2 days",
        });
        res.status(200).json({ token, email });
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
    const userExists = await User.findOne({ useremail: req.body.email }).exec();
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
      { useremail: req.body.email },
      {
        $set: {
          userpassID: passID,
          userpasstoken: passtoken,
          userpassstatus: false,
        },
      }
    );
    const getentry = await User.findById(result._id).exec();
    const verifyurl = `${process.env.BASE_URL}/forpass/${getentry.userpassID}/verify/${getentry.userpasstoken}`;
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
      userpassID: req.params.id,
      userpasstoken: req.params.token,
    }).exec();
    console.log(dataToVerify);
    if (!dataToVerify) return res.status(400).json({ message: "invalid link" });
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $set: { userpassstatus: true, userpassID: "", userpasstoken: "" } }
    );
    await User.findOneAndUpdate(
      { _id: dataToVerify._id },
      { $unset: { userpassID: "", userpasstoken: "" } }
    );
    res.status(200).json({ message: "Email verified Successfully" });
  } catch (err) {
    res.status(500).json({ message: `something went wrong; ${err}` });
  }
};

const resetpass = async (req, res) => {
  try {
    const userExists = await User.findOne({ useremail: req.body.email }).exec();
    if (!userExists)
      return res.status(401).json({ message: "Invalid Email ID" });
    let salt = await bcrypt.genSalt(Number(process.env.SALT));
    let hash = await bcrypt.hash(req.body.password, salt);
    if (userExists.userpassstatus) {
      await User.findOneAndUpdate(
        { useremail: req.body.email },
        {
          $set: {
            userpassword: hash,
          },
        }
      );
      await User.findOneAndUpdate(
        { useremail: req.body.email },
        { $unset: { userpassstatus: "" } }
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
module.exports = {
  register,
  verify,
  signin,
  forpass,
  verifypass,
  resetpass,
};
