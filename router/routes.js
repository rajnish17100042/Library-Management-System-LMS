const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
// saltRound for password hashing
const saltRounds = 12;

// requiring database connection
const db = require("../db/conn");

const Registration = require("../model/registrationSchema");

const validateInput = require("../validation/input_data_validation");
// const getTableName = require("../validation/get_table_name");
// const authenticate = require("../middleware/authentication");

// router.get("/", (req, res) => {
//   res.status(200).json({ success: true, message: "Hello from the Home Page" });
// });

//common registration route for student,librarian and admin
router.post("/register", async (req, res) => {
  // calling function for input validation
  const isInputValidated = validateInput(req);
  console.log(isInputValidated);

  if (!isInputValidated) {
    res.json({ success: false, message: "Please fill the data properly" });
  } else {
    try {
      //do not allow duplicate user having same role and email id
      const userExist = await Registration.findOne({
        email: req.body.email,
        role: req.body.role,
      });
      console.log(userExist);
      if (userExist) {
        return res.json({
          success: false,
          message: "user is already registered",
        });
      }
      delete req.body.cpassword;
      console.log(req.body);
      const register = new Registration(req.body);
      console.log(register);

      // here we will use 'pre' middleware to hash the password will define that middleware in the userSchema
      console.log("Before MongoDb save ");
      await register.save();
      console.log("After MongoDb save ");
      return res.json({
        success: true,
        message: "User registedred Successfully",
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err,
      });
    }
  }
});

// role based login system
router.post("/login", async (req, res) => {
  // first get the details send by the client
  const { email, password, role } = req.body;

  // server side input validation
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the details correctly",
    });
  }

  // check if user exist based on the email and role
  try {
    const userExist = await Registration.findOne({ email, role });
    console.log(userExist);
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User NOT exists" });
    } else {
      //compare the password
      bcrypt.compare(password, userExist.password, (err, result) => {
        if (err) {
          // throw err;
          return res
            .status(400)
            .json({ success: false, message: "OPPS !! Something went wrong" });
        } else if (!result) {
          return res
            .status(400)
            .json({ success: false, message: "OPPS !! Something went wrong" });
        }

        //generate access token or JWT for this user
        //syntax   jwt.sign(payload,secretKey,expiry,callbackFunction);
        // console.log(userExist);
        jwt.sign({ userExist }, secretKey, (err, token) => {
          if (err) {
            // throw err;
            return res.status(400).json({
              success: false,
              message: "OPPS !! Something went wrong",
            });
          }

          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 100000000000), //time in millisecond  100second
            httpOnly: true,
          });
          // console.log(token);
          res.json({
            success: true,
            access_token: token,
          });
        });
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "OPPS!! something went wrong" });
  }
});

module.exports = router;
