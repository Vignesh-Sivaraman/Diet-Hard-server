const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authenticate = require("../config/authenticate");

router
  .route("/getdashdata")
  .post(authenticate, reportController.getTotalNutrientsByDate);
router.route("/getmealplan").post(authenticate, reportController.getMealPlan);

module.exports = router;
