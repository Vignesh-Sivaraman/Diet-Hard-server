const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/register").post(usersController.register);
router.route("/signin").post(usersController.signin);
router.route("/forpass").post(usersController.forpass);
router.route("/resetpass").post(usersController.resetpass);
router.route("/userdetails").post(usersController.userdetails);

router.route("/register/:id/verify/:token").get(usersController.verify);
router.route("/forpass/:id/verify/:token").get(usersController.verifypass);

module.exports = router;
