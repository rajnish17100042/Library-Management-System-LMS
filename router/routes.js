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

const BookDetail = require("../model/bookDetailsSchema");
const IssueBook = require("../model/issueBookSchema");

const {
  validateInput,
  validateBookDetails,
} = require("../validation/input_data_validation");
const resetPasswordLinkMailer = require("../mailer/reset_password_link_mailer.js");
const authenticate = require("../middleware/authentication");
const password_generator = require("../password_generator/password_generator");
const passwordMailer = require("../mailer/password_mailer.js");

// const authenticate = require("../middleware/authentication");

// router.get("/", (req, res) => {
//   res.status(200).json({ success: true, message: "Hello from the Home Page" });
// });

//common registration route for student,librarian and admin
router.post("/register", async (req, res) => {
  // calling function for input validation
  const isInputValidated = validateInput(req.body);
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
      //generate random password and email this to user
      const random_password = password_generator();
      // console.log(random_password);
      req.body.password = random_password;
      // console.log(req.body);
      const register = new Registration(req.body);
      // console.log(register);

      // here we will use 'pre' middleware to hash the password will define that middleware in the userSchema
      // console.log("Before MongoDb save ");
      const is_saved = await register.save();

      // console.log("Checking if data is saved ?");
      // console.log(is_saved);

      if (!is_saved) {
        return res.json({
          success: false,
          message: "Something went Wrong",
        });
      } else {
        // console.log("sending password in mail");
        //send password on mail
        passwordMailer(req.body.email, req.body.name, random_password);
        // console.log("After MongoDb save ");
        return res.json({
          success: true,
          message: "User registedred Successfully! Please Check your mail",
        });
      }
    } catch (err) {
      // console.log(err);
      return res.json({
        success: false,
        message: "Something went Wrong",
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
          console.log(token);
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

//check if the user is already logged in
router.get("/checkAlreadyLogin", authenticate, (req, res) => {
  if (
    req.role !== "admin" &&
    req.role !== "librarian" &&
    req.role !== "student"
  ) {
    return res.json({ success: false, message: "Fill the details to log in" });
  } else {
    return res.json({ success: true, role: req.role });
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
              const isUpdated = await Registration.updateOne(
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

// route for admin dashboard page authentication
router.get("/adminDashboard", authenticate, (req, res) => {
  // console.log("Hello");
  // double checking
  if (req.role !== "admin") {
    return res.json({
      success: false,
      message: "Please Login",
    });
  } else {
    // console.log("admin data is:");
    // console.log(req.user);
    const adminData = req.user;
    // console.log(adminData[0]);
    return res.json({ success: true, adminData: adminData });
  }
});

// route for librarian dashboard page authentication
router.get("/librarianDashboard", authenticate, (req, res) => {
  if (req.role !== "librarian") {
    return res.json({
      success: false,
      message: "Please Login",
    });
  } else {
    const librarianData = req.user;

    return res.json({ success: true, librarianData });
  }
});

// route for student dashboard page authentication
router.get("/studentDashboard", authenticate, (req, res) => {
  if (req.role !== "student") {
    return res.json({
      success: false,
      message: "Please Login",
    });
  } else {
    const studentData = req.user;

    return res.json({ success: true, studentData });
  }
});

//route to get registration details
router.get("/registrationDetails", authenticate, async (req, res) => {
  if (req.role !== "admin") {
    return res.json({
      success: false,
      message: "Please Login",
    });
  } else {
    try {
      const userExist = await Registration.find();
      console.log(userExist);
      if (!userExist) {
        return res.json({ success: false, message: "No Users" });
      } else {
        console.log("storing data");
        return res.json({ success: true, message: userExist });
      }
    } catch (err) {
      // throw err;
      return res.json({ success: false, message: "Some Error Occured!" });
    }
  }
});

//route to enter book details in database
router.post("/addBook", authenticate, async (req, res) => {
  // console.log(req.body);
  // server side data validation
  try {
    const is_validated = validateBookDetails(req.body);
    if (!is_validated) {
      return res.json({
        success: false,
        message: "Please fill the data properly!",
      });
    } else {
      // store the book details into database
      // add available number of book copies to req.body
      req.body.available_copies = req.body.bk_copies;
      req.body.added_by = req.user.email;
      console.log(req.body);
      const bookDetail = new BookDetail(req.body);
      const is_saved = await bookDetail.save();
      console.log(is_saved);
      if (!is_saved) {
        return res.json({ success: false, message: "Some Error Occured" });
      } else {
        return res.json({ success: true, message: "Book Details Added" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Some Error Occured!" });
  }
});

// get book details
router.get("/getBooks", authenticate, async (req, res) => {
  if (req.role !== "librarian" && req.role !== "student") {
    return res.json({
      success: false,
      message: "Please Login",
    });
  } else {
    try {
      //if role is student then display all the available books and if role is librarian then display the books only added by the current librarian
      if (req.role === "student") {
        const books = await BookDetail.find();
        console.log(books);
        if (!books) {
          return res.json({ success: false, message: "No Books" });
        } else {
          return res.json({ success: true, books, role: req.role });
        }
      } else if (req.role === "librarian") {
        const books = await BookDetail.find({ added_by: req.user.email });
        console.log(books);
        if (!books) {
          return res.json({ success: false, message: "No Books" });
        } else {
          return res.json({ success: true, books, role: req.role });
        }
      }
    } catch (err) {
      // throw err;
      return res.json({ success: false, message: "Some Error Occured!" });
    }
  }
});

// issue a book
router.post("/issueBook", authenticate, async (req, res) => {
  if (req.role !== "student") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  console.log(req.body);
  const { book_id } = req.body;
  console.log(book_id);
  let issue_date = new Date().toLocaleDateString();
  console.log(issue_date);
  let return_date = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();
  console.log(return_date);
  const issueData = {
    issue_by: req.user.email,
    book_id,
    issue_date,
    return_date,
  };
  try {
    //  first check if the book is already issued by the user

    const is_issued = await IssueBook.findOne({
      book_id,
      issue_by: issueData.issue_by,
    });
    console.log(is_issued);
    if (is_issued) {
      return res.json({ success: false, message: "Already Issued this book" });
    } else {
      const issueBook = new IssueBook(issueData);
      const is_saved = await issueBook.save();
      console.log(is_saved);
      if (!is_saved) {
        return res.json({ success: false, message: "Some Error Occured" });
      } else {
        //reduce the number of books available by 1 in the bookdetails collection
        const isUpdated = await BookDetail.updateOne(
          { book_id },
          { $inc: { available_copies: -1 } }
        );
        console.log(isUpdated);
        // need to implement the Rollback feature in case the bookdetails collection didn't updated
        return res.json({ success: true, message: "Book Issued" });
      }
    }
  } catch (err) {
    // throw err;
    return res.json({ success: false, message: "Some Error Occured!" });
  }
});

// get issued book details
router.get("/getIssuedBooks", authenticate, async (req, res) => {
  if (req.role !== "student") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  try {
    const user = req.user.email;
    // get all the books issued by the user from issuebooks mongodb collection
    const issuedBooks = await IssueBook.find({ issue_by: user });
    console.log(issuedBooks);
    //now get all the book ids
    const book_ids = [];
    for (let i = 0; i < issuedBooks.length; i++) {
      book_ids.push(issuedBooks[i].book_id);
    }
    console.log(book_ids);

    //now get all the detalis of books issued by user from bookdetails collection
    const bookDetails = await BookDetail.find({ book_id: book_ids });
    console.log(bookDetails);

    const combined_book_data = [];
    for (let i = 0; i < bookDetails.length; i++) {
      let m = -1;
      for (let j = 0; j < issuedBooks.length; j++) {
        if (bookDetails[i].book_id === issuedBooks[j].book_id) {
          m = j;
          break;
        }
      }
      combined_book_data.push({
        book_id: bookDetails[i].book_id,
        bk_name: bookDetails[i].bk_name,
        author: bookDetails[i].author,
        publisher: bookDetails[i].publisher,
        bk_category: bookDetails[i].bk_category,
        issue_date: issuedBooks[m].issue_date,
        return_date: issuedBooks[m].return_date,
        fine: issuedBooks[m].fine,
      });
    }
    //time complexity is O(n*n)
    // use binary search to get nlogn time complexity
    console.log(combined_book_data);
    return res.json({ success: true, books: combined_book_data });
  } catch (err) {
    // throw err
    return res.json({ success: false, message: "Please Try Again" });
  }
});

// display all the users who issued a book
router.get("/listIssuedBooks/:book_id", authenticate, async (req, res) => {
  if (req.role !== "librarian") {
    return res.json({
      success: false,
      message: "Not Have Proper Access",
    });
  }

  const { book_id } = req.params;
  console.log(book_id);

  //now  get the list of all users who have issued the book having book_id as the req.params

  try {
    const issuedBooks = await IssueBook.find({ book_id });
    console.log(issuedBooks);
    if (!issuedBooks) {
      return res.json({
        success: false,
        message: "No one have issued this book",
      });
    }
    return res.json({ success: true, issuedBooks });
  } catch (err) {
    // throw err;
    return res.json({
      success: false,
      message: "Some Error Occured!",
    });
  }
});

//get updation details of a user
router.get("/updateUser/:email/:role", authenticate, async (req, res) => {
  if (
    req.role !== "admin" &&
    req.role !== "librarian" &&
    req.role !== "student"
  ) {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }

  try {
    const { email, role } = req.params;
    // get the user details using email and role
    const user = await Registration.find({ email, role });
    console.log(user);
    if (!user) {
      return res.json({ success: false, messsage: "User details not found" });
    } else {
      return res.json({ success: true, user });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
});

//update user
router.post("updateUser", authenticate, (req, res) => {
  if (
    req.role !== "admin" &&
    req.role !== "librarian" &&
    req.role !== "student"
  ) {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }

  try {
    //validate input data
    console.log(req.body);
    req.body.role = req.role;
    const{name,email,phone,address,city,state,pincode}=req.body;
    // calling function for input validation
    const isInputValidated = validateInput(req.body);
    // console.log(isInputValidated);

    if (!isInputValidated) {
      res.json({ success: false, message: "Please fill the data properly" });
    }else{
      //update user detail using email and password  
        const isUpdated = await Registration.updateOne(
                { email, role },
                { $set: {name,email,phone,address,city,state,pincode } }
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
                  message: "Details Updated",
                });
              }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
});
//route for Logout
router.get("/logout", authenticate, (req, res) => {
  // console.log("reaching to logout route");
  res.clearCookie("accessToken");
  return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
