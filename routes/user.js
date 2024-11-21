const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router
.route("/signup")
.get(userController.renderSignupForm) //Render Signup Form Route
.post(wrapAsync(userController.signup)) //Signup Route
 

router
.route("/login")
.get(userController.renderLoginForm) //Render Login Form Route
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login); //Login Route




//Logout Route
router.get("/logout", userController.logout)

module.exports = router;