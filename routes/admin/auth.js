const express = require("express");
const {check, validationResult} = require("express-validator");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
} = require("./validators");
const e = require("express");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({req}));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.send(signupTemplate({req, errors}));
    }

    const {email, password, passwordConfirmation} = req.body;
    const user = await usersRepo.create({email, password});

    // Store the id of that user inside the users cookie
    req.session.userId = user.id;

    res.send("Thanks for signing up!");
  }
);

router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are signed out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate());
});

router.post(
  "/signin",
  [
    check("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Must be a valid email")
      .custom(async (email) => {
        const user = await usersRepo.getOneBy({email});
        if (!user) {
          throw new Error("Email not found");
        }
      }),
    check("password").trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    const {email, password} = req.body;

    const user = await usersRepo.getOneBy({email});

    if (!user) {
      return res.send("Email not found");
    }

    const validPassword = await usersRepo.comparePasswords(
      user.password,
      password
    );

    if (!validPassword) {
      return res.send("Invalid Password");
    }

    req.session.userId = user.id;

    res.send("You are signed in!");
  }
);

module.exports = router;
