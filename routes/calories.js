const express = require("express");
const router = express.Router();
const caloriesController = require("../controllers/caloriesController");
const authenticate = require("../config/authenticate");

router.route("/").post(authenticate, caloriesController.addentry);
router
  .route("/getcalories")
  .post(authenticate, caloriesController.getcaloriebydate);

module.exports = router;
