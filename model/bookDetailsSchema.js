const mongoose = require("mongoose");
const bookDetailsSchema = new mongoose.Schema({
  // user_id: {
  //   type: String,
  //   required: true,
  // },
  book_id: {
    type: String,
    required: true,
    unique: true,
  },
  bk_title: {
    type: String,
    required: true,
  },
  bk_name: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  bk_copies: {
    type: Number,
    required: true,
  },
  bk_category: {
    type: String,
    required: true,
  },
  available_copies: {
    type: Number,
    required: true,
  },
  added_by: {
    type: String,
    required: true,
  },
});

const bookDetail = mongoose.model("bookDetail", bookDetailsSchema);
module.exports = bookDetail;
