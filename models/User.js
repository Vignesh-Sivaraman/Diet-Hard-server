const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  useremail: String,
  userpassword: String,
  usertype: String,
  userverified: Boolean,
  userhashID: String,
  usertoken: String,
  userpassID: String,
  userpasstoken: String,
  userpassstatus: Boolean,
});

module.exports = mongoose.model("User", userSchema);
