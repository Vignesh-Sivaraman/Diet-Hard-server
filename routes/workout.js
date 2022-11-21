const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const authenticate = require("../config/authenticate");

router.route("/").post(authenticate, workoutController.addentry);

module.exports = router;
