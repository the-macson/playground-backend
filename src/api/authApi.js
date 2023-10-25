const {
  checkDuplicateEmailOfUser,
  checkDuplicateUsernameOfUser,
} = require("../middlewares/VerfiySignUp");

const { signup, signin } = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();

router.post(
  "/register",
  [checkDuplicateUsernameOfUser, checkDuplicateEmailOfUser],
  signup
);
router.post("/login", signin);

module.exports = router;
