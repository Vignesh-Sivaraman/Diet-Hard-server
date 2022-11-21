const express = require("express");
const router = express.Router();
const waterController = require("../controllers/waterController");
const authenticate = require("../config/authenticate");

router.route("/").post(authenticate, waterController.addentry);

module.exports = router;
