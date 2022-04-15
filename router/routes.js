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
const FineTransaction = require("../model/fineTransactionSchema");
const FineHistory = require("../model/fineHistory");

const {
  validateInput,
  validateBookDetails,
} = require("../validation/input_data_validation");
const resetPasswordLinkMailer = require("../mailer/reset_password_link_mailer.js");
const authenticate = require("../middleware/authentication");
const password_generator = require("../password_generator/password_generator");
const passwordMailer = require("../mailer/password_mailer.js");
const calculate_fine = require("../fine/single_book_fine.js");
const res = require("express/lib/response");

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
          message: "User is Already Registered",
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
          message: "Something went Wrong,Please Try Again",
        });
      } else {
        // console.log("sending password in mail");
        //send password on mail
        passwordMailer(
          req.body.email,
          req.body.role,
          req.body.name,
          random_password
        );
        // console.log("After MongoDb save ");
        return res.json({
          success: true,
          message: "User registedred Successfully!",
        });
      }
    } catch (err) {
      // console.log(err);
      return res.json({
        success: false,
        message: "Something went Wrong,Please Try Again",
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
      return res.json({ success: false, message: "User NOT Exists" });
    } else {
      //compare the password
      bcrypt.compare(password, userExist.password, (err, result) => {
        if (err) {
          // throw err;
          return res.json({
            success: false,
            message: "Something went Wrong,Please Try Again",
          });
        } else if (!result) {
          return res.json({
            success: false,
            message: "Invalid credential",
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
              message: "Something went Wrong,Please Try Again",
            });
          }

          res.cookie("accessToken", token, {
            expiresIn: "15min",
            httpOnly: true,
          });
          console.log(token);
          res.json({
            success: true,
            message: "Logged In Successfully",
            access_token: token,
            role,
          });
        });
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

//check if the user is already logged in
router.get("/checkAlreadyLogin", authenticate, (req, res) => {
  if (
    req.role !== "admin" &&
    req.role !== "librarian" &&
    req.role !== "student"
  ) {
    return res.json({ success: false, message: "Please Enter the details" });
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
        message: "Please Check your mail for password reset link",
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
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
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
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
            message: "Something went Wrong,Please Try Again",
          });
        } else {
          // hash the password and update the database query
          bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
              return res.json({
                success: false,
                message: "Something went Wrong,Please Try Again",
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
                  message: "Something went Wrong,Please Try Again",
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
      return res.json({
        success: false,
        message: "Something went Wrong,Please Try Again",
      });
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
      message: "Please Login First",
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
      return res.json({
        success: false,
        message: "Something went Wrong,Please Try Again",
      });
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
        return res.json({
          success: false,
          message: "Something went Wrong,Please Try Again",
        });
      } else {
        return res.json({ success: true, message: "Book Details Added" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
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
      return res.json({
        success: false,
        message: "Something went Wrong,Please Try Again",
      });
    }
  }
});

// get route to update a book
router.get("/getBook/:book_id", authenticate, async (req, res) => {
  if (req.role !== "librarian") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  const { book_id } = req.params;
  const book = await BookDetail.findOne({ book_id: book_id });
  if (!book) {
    return res.json({ success: false, message: "Book Details Not Found " });
  } else {
    console.log(book);
    return res.json({ success: true, book });
  }
});

// update a book
router.post("/updateBook/:book_id", authenticate, async (req, res) => {
  if (req.role !== "librarian") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  const { book_id } = req.params;
  // server side validation
  req.body.book_id = book_id;
  const is_validated = validateBookDetails(req.body);
  if (!is_validated) {
    return res.json({
      success: false,
      message: "Please fill the data properly!",
    });
  }

  try {
    //we have to update total book copies and the available number of copies
    const book = await BookDetail.findOne({ book_id });
    if (!book) {
      return res.json({ success: false, message: "Book Details Not Found " });
    }
    const increased_copies = req.body.bk_copies - book.bk_copies;
    const available_copies = book.available_copies + increased_copies;
    // both increase and decrease will be handled
    console.log(increased_copies);
    //update the book details
    const is_updated = await BookDetail.updateOne(
      { book_id },
      { $set: { bk_copies: req.body.bk_copies, available_copies } }
    );

    if (!is_updated) {
      return res.json({
        success: false,
        messsage: "Something went Wrong,Please Try Again",
      });
    } else {
      console.log(is_updated);
      return res.json({ success: true, message: "Book Details Updated!!" });
    }
  } catch (err) {
    // throw err
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
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
    //check if user is having previous fine on the cuurent book
    const previousfine = await FineHistory.findOne(
      {
        issue_by: req.user.email,
        book_id,
      },
      { fine: 1, _id: 0 }
    );
    console.log(previousfine);

    if (previousfine && previousfine.fine) {
      return res.json({
        sucess: false,
        message: "You are having fine for this book",
      });
    }
    //  check if the book is already issued by the user

    const is_issued = await IssueBook.findOne({
      book_id,
      issue_by: issueData.issue_by,
      is_return: 0,
    });
    console.log(is_issued);
    if (is_issued) {
      return res.json({ success: false, message: "Already Issued this book" });
    }

    // now check the availability of the book
    const book = await BookDetail.findOne({ book_id });
    if (!book.available_copies) {
      return res.json({ success: false, message: "Book Not Available" });
    } else {
      const issueBook = new IssueBook(issueData);
      const is_saved = await issueBook.save();
      console.log(is_saved);
      if (!is_saved) {
        return res.json({
          success: false,
          message: "Something went Wrong,Please Try Again",
        });
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
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
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
    const issuedBooks = await IssueBook.find({
      issue_by: user,
      is_return: 0,
    });
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
    //now calculate fine for each book
    for (let i = 0; i < combined_book_data.length; i++) {
      combined_book_data[i].fine = calculate_fine(
        combined_book_data[i].return_date
      );
    }

    const fineHistory = await FineHistory.find(
      { issue_by: user },
      { fine: 1, _id: 0 }
    );
    console.log(fineHistory);
    //calculate total fine of an user
    let totalfine = 0;
    for (let i = 0; i < fineHistory.length; i++) {
      totalfine += fineHistory[i].fine;
    }
    for (let i = 0; i < combined_book_data.length; i++) {
      totalfine += combined_book_data[i].fine;
    }

    console.log(combined_book_data);
    return res.json({ success: true, books: combined_book_data, totalfine });
  } catch (err) {
    // throw err
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

// display all the users who issued a book .... librarian dashboard
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
    const issuedBooks = await IssueBook.find({ book_id, is_return: 0 });
    console.log(issuedBooks);
    if (!issuedBooks) {
      return res.json({
        success: false,
        message: "No one have issued this book",
      });
    }

    for (let i = 0; i < issuedBooks.length; i++) {
      issuedBooks[i].fine = calculate_fine(issuedBooks[i].return_date);
    }
    console.log(issuedBooks);
    return res.json({ success: true, issuedBooks });
  } catch (err) {
    // throw err;
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

//get route for the details of single book for return purpose
router.get("/getIssuedBook/:book_id/:email", authenticate, async (req, res) => {
  console.log("entering fine route");
  if (req.role !== "librarian") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  const { book_id, email } = req.params;
  try {
    const issuedBook = await IssueBook.findOne({
      book_id,
      issue_by: email,
      is_return: 0,
    });
    if (!issuedBook) {
      return res.json({ success: false, message: "Book details not found" });
    }
    console.log(issuedBook);
    //calculate fine and update the fine property then send the data to frontend
    const fine = calculate_fine(issuedBook.return_date);
    console.log(fine);

    issuedBook.fine = fine;

    return res.json({ success: true, issuedBook });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

//returning a book
router.post("/returnBook", authenticate, async (req, res) => {
  if (req.role !== "librarian") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  const { book_id, email, issue_date, return_date, fine } = req.body;

  try {
    if (!book_id || !email || !issue_date || !return_date || !fine) {
      return res.json({ success: false, message: "Insufficient Data" });
    }
    //  in issuebook collection make is_return to true
    const is_updated_book = await IssueBook.updateOne(
      { book_id: book_id, issue_by: email },
      { $set: { is_return: 1 } }
    );
    console.log(is_updated_book);
    if (!is_updated_book.modifiedCount) {
      return res.json({
        success: false,
        message: "Issue Book Not Updated",
      });
    }
    //update fine in fine collection
    const is_updated_fine = await Registration.updateOne(
      { email },
      { $inc: { fine } }
    );
    console.log(is_updated_fine);
    if (!is_updated_fine.modifiedCount) {
      return res.json({
        success: false,
        message: "fine not updated",
      });
    }

    //if some error occured in the middle the we will have to rollback
    //how to rollback

    //update available_copies in bookdetails collection by 1;
    const update_available_copies = await BookDetail.updateOne(
      { book_id },
      { $inc: { available_copies: 1 } }
    );
    console.log(update_available_copies);
    // save the fine history in the finehistory collection
    const current_date = new Date().toLocaleDateString();
    const fine_data = {
      issue_by: email,
      book_id,
      issue_date,
      actual_return_date: return_date,
      user_return_date: current_date,
      fine,
    };
    const finehistory = new FineHistory(fine_data);
    const is_saved = await finehistory.save();
    console.log(is_saved);
    return res.json({ success: true, message: "Book Returned Successfully" });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
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
    const user = await Registration.findOne({ email, role });
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
router.post("/updateUser/:role", authenticate, async (req, res) => {
  if (req.role !== "admin") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }

  try {
    //validate input data
    console.log(req.body);
    const { role } = req.params;
    req.body.role = role;
    const { name, email, phone, address, city, state, pincode } = req.body;
    // calling function for input validation
    const isInputValidated = validateInput(req.body);
    // console.log(isInputValidated);

    if (!isInputValidated) {
      res.json({ success: false, message: "Please fill the data properly" });
    } else {
      //update user detail using email and password
      const isUpdated = await Registration.updateOne(
        { email, role },
        { $set: { name, email, phone, address, city, state, pincode } }
      );
      console.log(isUpdated.modifiedCount);
      if (!isUpdated.modifiedCount) {
        return res.json({
          success: false,
          message: "Something went Wrong,Please Try Again",
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

//route to protect update password page
router.get("/updatePassword", authenticate, (req, res) => {
  if (
    req.role !== "admin" &&
    req.role !== "librarian" &&
    req.role !== "student"
  ) {
    return res.json({ success: false, message: "Not Have Proper Access" });
  } else {
    return res.json({ success: true, message: "Loading...." });
  }
});

// route to update password using email and role
router.post("/updatePassword/:email/:role", authenticate, async (req, res) => {
  if (
    req.role !== "admin" &&
    req.role !== "librarian" &&
    req.role !== "student"
  ) {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  const { email, role } = req.params;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  console.log(req.body);
  if (
    !currentPassword ||
    !newPassword ||
    !confirmNewPassword ||
    newPassword !== confirmNewPassword
  ) {
    return res.json({
      success: false,
      message: "Please fill the data properly",
    });
  }

  try {
    //  check if user with email and role exist
    const userExist = await Registration.findOne({ email, role });
    console.log(userExist);
    // now compare the current password with password saved in the database
    if (!userExist) {
      return res.json({ success: false, message: "User NOT exists" });
    } else {
      //compare the password
      bcrypt.compare(currentPassword, userExist.password, (err, result) => {
        if (err) {
          // throw err;
          return res.json({
            success: false,
            message: "Something went Wrong,Please Try Again",
          });
        } else if (!result) {
          return res.json({
            success: false,
            message: "Something went Wrong,Please Try Again",
          });
        }

        //now hash the new password and update in database
        bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
          if (err) {
            return res.json({
              success: false,
              message: "Something went Wrong,Please Try Again",
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
                message: "Something went Wrong,Please Try Again",
              });
            } else {
              return res.json({
                success: true,
                message: "Password Changed Successfully",
              });
            }
          }
        });
      });
    }
  } catch (err) {
    // throw err
    return res.json({
      success: false,
      message: "Something went wrong, Please try again",
    });
  }
});

// route to get fine details
router.get("/getFineDetails/:email", authenticate, async (req, res) => {
  if (req.role !== "librarian") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  const { email } = req.params;
  try {
    const fineData = await Registration.findOne(
      { email },
      { email: 1, fine: 1 }
    );
    console.log(fineData);
    if (!fineData) {
      return res.json({ success: false, message: "Fine Details Not Found" });
    }
    return res.json({ success: true, fineData });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

//route to pay fine on behalf os student
router.post("/payFine", authenticate, async (req, res) => {
  if (req.role !== "librarian") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }

  try {
    const { email, book_id, amount, purpose } = req.body;
    console.log(email, book_id, amount, purpose);
    if (!email || !amount || !purpose) {
      return res.json({
        success: false,
        message: "Please Fill All the Details",
      });
    }
    //reduce the fine
    const is_finereduced = await Registration.updateOne(
      { email },
      { $inc: { fine: -amount } }
    );

    if (!is_finereduced) {
      return res.json({
        success: false,
        message: "Something went Wrong,Please Try Again",
      });
    }

    //update finehistory collection
    const finehistoryupdated = await FineHistory.updateOne(
      { issue_by: email },
      { $inc: { fine: -amount } }
    );

    console.log(finehistoryupdated);
    //now add the transaction
    const current_date = new Date().toLocaleDateString();
    const transaction_data = {
      user_id: email,
      amount,
      transaction_date: current_date,
      purpose,
    };

    const finetransaction = new FineTransaction(transaction_data);
    const is_saved = await finetransaction.save();
    if (!is_saved) {
      return res.json({
        success: false,
        message: "Something went Wrong,Please Try Again",
      });
    }
    console.log(is_saved);
    return res.json({ success: true, message: "Fine Paid Successfully" });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

//fine histroy
router.get("/getFineHistory", authenticate, async (req, res) => {
  if (req.role !== "student") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  try {
    const finehistory = await FineHistory.find({
      issue_by: req.user.email,
    });
    return res.json({ success: true, finehistory });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

//fine history using email as a parameter
//fine histroy
router.get("/getFineHistory/:email", authenticate, async (req, res) => {
  if (req.role !== "librarian") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  try {
    const { email } = req.params;
    const finehistory = await FineHistory.find({
      issue_by: email,
    });
    return res.json({ success: true, finehistory });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});
//get transaction details of an user
router.get("/getTransactions", authenticate, async (req, res) => {
  if (req.role !== "student") {
    return res.json({ success: false, message: "Not Have Proper Access" });
  }
  try {
    const transactions = await FineTransaction.find({
      user_id: req.user.email,
    });
    return res.json({ success: true, transactions });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Something went Wrong,Please Try Again",
    });
  }
});

// //fine calculation
// router.get("/calculateFine", async (req, res) => {
//   const { issue_by, book_id, current_date } = req.body;
//   const issue_book = await IssueBook.findOne({ issue_by, book_id });
//   console.log(issue_book);
//   const return_date = issue_book.return_date;
//   const date_array = return_date.split("/");
//   const date_array2 = current_date.split("/");
//   const current_date_day =
//     new Date(date_array2[2], date_array2[0], date_array2[1]).getTime() /
//     (1000 * 60 * 60 * 24);
//   const return_date_day =
//     new Date(date_array[2], date_array[0], date_array[1]).getTime() /
//     (1000 * 60 * 60 * 24);
//   const late = current_date_day - return_date_day;
//   console.log("number of late days : ", late);
//   console.log("fine for this book is : $ ", late * 10);
//   // console.log(date_array);
//   // const day3 =
//   //   new Date(date_array[2], date_array[0], date_array[1]).getTime() /
//   //   (1000 * 60 * 60 * 24);
//   //new Date(yyyy,mm,dd);
//   // const day1 = new Date(2022, 4, 5).getTime() / (1000 * 60 * 60 * 24);
//   // const day2 = new Date(2022, 4, 5).getTime() / (1000 * 60 * 60 * 24);
//   // console.log(day3 - day1);

//   // console.log(new Date().toDateString());
//   // const current_date_sec = new Date().getTime() / 1000;
//   // console.log(current_date_sec);
//   res.json({ late });
// });

//test route
router.get("/test", async (req, res) => {
  const fineHistory = await FineHistory.find(
    { issue_by: "rajnishk@spanidea.com" },
    { fine: 1, _id: 0 }
  );
  console.log(fineHistory);
  res.json({ fineHistory });
});
//route for Logout
router.get("/logout", authenticate, (req, res) => {
  // console.log("reaching to logout route");
  res.clearCookie("accessToken");
  return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
