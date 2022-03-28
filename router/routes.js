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
const resetPasswordLinkMailer = require("../mailer/reset_password_link_mailer.js");
const authenticate = require("../middleware/authentication");

// const authenticate = require("../middleware/authentication");

// router.get("/", (req, res) => {
//   res.status(200).json({ success: true, message: "Hello from the Home Page" });
// });

//common registration route for student,librarian and admin
router.post("/register", async (req, res) => {
  // calling function for input validation
  const isInputValidated = validateInput(req);
  // console.log(isInputValidated);

  if (!isInputValidated) {
    res.json({ success: false, message: "Please fill the data properly" });
  } else {
    try {
      //do not allow duplicate user having same role and email id
      const userExist = await Registration.findOne({
        email: req.body.email,
        role: req.body.role,
      });
      // console.log(userExist);
      if (userExist) {
        return res.json({
          success: false,
          message: "user is already registered",
        });
      }
      delete req.body.cpassword;
      // console.log(req.body);
      const register = new Registration(req.body);
      // console.log(register);

      // here we will use 'pre' middleware to hash the password will define that middleware in the userSchema
      // console.log("Before MongoDb save ");
      await register.save();
      // console.log("After MongoDb save ");
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
    return res.json({
      success: false,
      message: "Please fill all the details correctly",
    });
  }

  // check if user exist based on the email and role
  try {
    const userExist = await Registration.findOne({ email, role });
    // console.log(userExist);
    if (!userExist) {
      return res.json({ success: false, message: "User NOT exists" });
    } else {
      //compare the password
      bcrypt.compare(password, userExist.password, (err, result) => {
        if (err) {
          // throw err;
          return res.json({
            success: false,
            message: "OPPS !! Something went wrong",
          });
        } else if (!result) {
          return res.json({
            success: false,
            message: "OPPS !! Something went wrong",
          });
        }

        //generate access token or JWT for this user
        //syntax   jwt.sign(payload,secretKey,expiry,callbackFunction);
        // console.log(userExist);
        jwt.sign({ userExist }, secretKey, (err, token) => {
          if (err) {
            // throw err;
            return res.json({
              success: false,
              message: "OPPS !! Something went wrong",
            });
          }

          res.cookie("accessToken", token, {
            expiresIn: "15min",
            httpOnly: true,
          });
          // console.log(token);
          res.json({
            success: true,
            access_token: token,
            role,
          });
        });
      });
    }
  } catch (err) {
    return res.json({ success: false, message: "OPPS!! something went wrong" });
  }
});

// route for forget password ...will check for user existence in database and send
router.post("/forgetPassword", async (req, res) => {
  // get the request body
  // console.log(req.body);
  const { email, role } = req.body;

  // server side validation   ....what if request is sent from postman
  if (!email || !role) {
    return res.json({
      success: false,
      message: "Please Fill the data properly",
    });
  }
  //check if user exists in the database
  try {
    const userExist = await Registration.findOne({ email, role });
    // console.log(userExist);
    if (!userExist) {
      return res.json({ success: false, message: "User NOT exists" });
    } else {
      const password = userExist.password;
      //user exists and now create one time link valid for 15 minutes  for that generate a new secret key using original secret key and user password stored in the database
      const secret = secretKey + password; //this secret is unique for all users
      //now define the payload for the jwt
      const payload = {
        email,
        role,
      };

      //now generate jwt
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      // console.log(token);
      //now generate the reset password link
      const resetPasswordLink = `https://library-management-system-lms1.herokuapp.com/reset-password/${role}/${email}/${token}`;
      // console.log(resetPasswordLink);
      //send the reset password link to email
      resetPasswordLinkMailer(email, resetPasswordLink);

      return res.json({
        success: true,
        message: "Check your mail for password reset link",
      });
    }
  } catch (err) {
    return res.json({ success: false, message: "OPPS!! something went wrong" });
  }
});

// get route to verify the token for the Reset Password Feature
router.get("/resetPassword/:role/:email/:token", async (req, res) => {
  const params = req.params;
  const { role, email, token } = params;

  // use try catch block to verify token
  try {
    const userExist = await Registration.findOne({ email, role });
    // console.log(userExist);
    if (!userExist) {
      return res.json({ success: false, message: "User NOT exists" });
    } else {
      const password = userExist.password;
      const secret = secretKey + password; //this secret is unique for all users
      const payload = jwt.verify(token, secret); //returns the payload if token verified
      console.log(payload);
      return res.json({
        success: true,
        message: "Reset Password Page is rendering",
      });
    }
  } catch (err) {
    // throw err;
    return res.json({ success: false, message: "Some Error Occured!" });
  }
});

// post method for Reset Password Feature to update the password
router.post("/resetPassword/:role/:email/:token", async (req, res) => {
  console.log("Hitting Post Reset Password Route");
  console.log(req.body);
  console.log(req.params);
  const { role, email, token } = req.params;
  const { password, cpassword } = req.body;
  //server side validation
  if (!password || !cpassword || password !== cpassword) {
    return res.json({ success: false, message: "Please fill data properly" });
  } else {
    // double check for reset password token
    try {
      const userExist = await Registration.findOne({ email, role });
      // console.log(userExist);
      if (!userExist) {
        return res.json({ success: false, message: "User NOT exists" });
      } else {
        const dbPassword = userExist.password;
        const secret = secretKey + dbPassword; //this secret is unique for all users
        const payload = jwt.verify(token, secret); //returns the payload if token verified
        console.log(payload);
        if (!payload) {
          return res.json({
            success: false,
            message: "OPPS!! Something went wrong",
          });
        } else {
          // hash the password and update the database query
          bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
              return res.json({
                success: false,
                message: "OPPS!! Something went wrong",
              });
            } else {
              const isUpdated = await Registration.update(
                { email, role },
                { $set: { password: hash } }
              );
              console.log(isUpdated.modifiedCount);
              if (!isUpdated.modifiedCount) {
                return res.json({
                  success: false,
                  message: "Some Error Occured!",
                });
              } else {
                return res.json({
                  success: true,
                  message: "Password Changed Successfully",
                });
              }
            }
          });
        }
      }
    } catch (err) {
      // throw err;
      return res.json({ success: false, message: "Some Error Occured!" });
    }
  }
});

// route for admin dashboard
router.get("/adminDashboard", authenticate, (req, res) => {
  // console.log("Hello");
  // double checking
  if (req.role !== "admin") {
    return res.json({
      success: false,
      message: "Page can't be rendered! Login First",
    });
  } else {
    const adminData = req.user;
    // console.log(adminData[0]);
    return res.json({ success: true, adminData: adminData[0] });
  }
});

module.exports = router;
