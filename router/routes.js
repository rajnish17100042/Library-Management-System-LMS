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

router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Hello from the Home Page" });
});

router.post("/register", async (req, res) => {
  // calling function for input validation
  const isInputValidated = validateInput(req);
  console.log(isInputValidated);

  if (!isInputValidated) {
    res.json({ success: false, message: "Please fill the data properly" });
  } else {
    try {
      const userExist = await Registration.findOne({ email: req.body.email });
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

module.exports = router;
