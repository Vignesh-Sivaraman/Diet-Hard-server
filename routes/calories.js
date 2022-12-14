const express = require("express");
const router = express.Router();
const caloriesController = require("../controllers/caloriesController");
const authenticate = require("../config/authenticate");

router.route("/").post(authenticate, caloriesController.addentry);

module.exports = router;
