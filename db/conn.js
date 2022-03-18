const mongoose = require("mongoose");

// connect to database
const db = process.env.MONGO_DATABASE;

// create connection
mongoose
  .connect(db)
  .then(() => {
    console.log("connection successful");
  })
  .catch((error) => {
    console.log(error);
  });
