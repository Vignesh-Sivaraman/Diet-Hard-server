const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waterSchema = new Schema({
  userEmail: String,
  date: String,
  waterQty: Number,
});

module.exports = mongoose.model("Water", waterSchema);
