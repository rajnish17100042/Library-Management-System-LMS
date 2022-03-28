const jwt = require("jsonwebtoken");
// requiring database connection
const db = require("../db/conn");
const Registration = require("../model/registrationSchema");

const secretKey = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  // console.log("inside authenticate function");

  try {
    //   get the access token from the cookie
    // console.log("inside try block of authenticate middleware");
    // console.log(req);
    const token = req.cookies.accessToken;
    console.log(token);

    // let's verify the token and get the user details
    const verifyToken = jwt.verify(token, secretKey);
    console.log("verify token is");
    console.log(verifyToken);

    // //now check in the database if the user is present with the valid role
    let { email, password, role } = verifyToken.payload;

    const userExist = await Registration.findOne({ email, role, password });
    console.log("userexist is");
    console.log(userExist);
    if (!userExist) {
      return res.json({ success: false, message: "User NOT exists" });
    } else {
      req.user = result;
      req.role = role;
      next();
    }
  } catch (err) {
    // console.log(err);
    return res.json({ success: false, message: "Something is missing" });
  }
};

// export the authenticate function so that wew can use it in other file also
module.exports = authenticate;
