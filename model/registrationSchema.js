const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 12; //by default it is 10
const registrationSchema = new mongoose.Schema({
  // user_id: {
  //   type: String,
  //   required: true,
  // },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// // using pre middleware to hash the password
registrationSchema.pre("save", async function (next) {
  //we have to hash the password only if it is modified i.e password field is filled
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
    console.log(this.password);
    console.log("inside the pre middleware");
  }
  // now call the next function to execute the further code
  next();
});

// defining the Model User  ..    here "user" is a collection and userSchema is the schema of the collection(model)
const registration = mongoose.model("registration", registrationSchema);
module.exports = registration;
