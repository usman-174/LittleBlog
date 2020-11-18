const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");
const { check, validationResult } = require("express-validator");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) =>
  res.render("login", { title: "LOGIN" })
);
let errors = [];
// Register Page
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register", {
    title: "Register",
    errors,
    req: req.body,
  });
});

// Register
router.post(
  "/register",
  [
    check("name", "Name must be atleast 5 Characters long.")
      .not()
      .isEmpty()
      .escape()
      .isLength({ min: 5 }),

    check("email", "Please enter a valid email")
      .custom((email) => {
        return User.findOne({ email }).then((User) => {
          if (User) {
            throw new Error("Email already in Use.");
          }
        });
      })
      .isEmail()
      .normalizeEmail()
      .not()
      .isEmpty(),

    check("password")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isLength({ min: 8 })
      .withMessage("Password length must be atleast 8 character"),
  ],

  (req, res) => {
    let errors = validationResult(req);
    const { name, email, password, password2 } = req.body;
    const error = errors.array();

    if (!errors.isEmpty() && password !== password2) {
      error.push({ msg: "Password did not Match." });
      console.log(error);
      res.render("register", {
        errors: error,
        title: "Register",
        req: req.body,
      });
    } else if (!errors.isEmpty()) {
      res.render("register", {
        errors: error,
        req: req.body,
        title: "Register",
      });
    } else if (password !== password2) {
      error.push({ msg: "Password did not Match." });
      console.log(error);
      res.render("register", {
        errors: error,
        req: req.body,
        title: "Register",
      });
    } else {
      const newUser = new User({
        email,
        name,
        password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              req.flash("success_msg", "You are now registered and can log in");
              res.redirect("/users/login");
            })
            .catch((err) => console.log(err));
        });
      });
    }
  }
);

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/data",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
