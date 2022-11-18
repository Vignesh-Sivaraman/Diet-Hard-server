const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

dotenv.config();

// initializing express

const app = express();

// MidleWare

app.use(express.json());

//cors

app.use(cors());

//connect to mongoDB

connectDB();

// Web Server Check

app.get("/", (req, res) => {
  res.json({ message: "Reporting for duty" });
});

app.use("/users", require("./routes/users"));
app.use("/usercalories", require("./routes/calories"));

// port listen

mongoose.connection.once("open", () => {
  console.log("connected to Mongodb");
  app.listen(process.env.PORT || 3005, () => {
    console.log("server listening on port 3005");
  });
});
