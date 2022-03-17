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
// const db = require("../db/conn");

const validateInput = require("../validation/input_data_validation");
// const getTableName = require("../validation/get_table_name");
// const authenticate = require("../middleware/authentication");

router.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Hello from the Home Page" });
});
module.exports = router;
