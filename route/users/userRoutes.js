const express = require("express");
const {
  userRegisterController,
  userSignInController,
} = require("../../controller/users/UserController");
const { verifySignUp } = require("../../middleware");

const userRoutes = express.Router();

userRoutes.post(
  "/register",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  userRegisterController
);
userRoutes.post("/signin", userSignInController);

module.exports = userRoutes;
