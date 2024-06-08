const express = require("express");
const router = express.Router();
const signupControls = require("../../conttrols/signupConttrols.js"); // Corrected typo

const { isRedirect } = require("../../middleware.js");  
const passport = require("passport");

router.get("/signup", signupControls.signup); 

router.post("/signup", signupControls.createForm);

router.get("/login", signupControls.login);

router.get('/logout', signupControls.logout);

router.post("/login", isRedirect, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), signupControls.createLoginForm); // Corrected middleware chain

module.exports = router;