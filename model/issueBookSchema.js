const mongoose = require("mongoose");
const issueBookSchema = new mongoose.Schema({
  issue_by: {
    type: String,
    required: true,
  },
  book_id: {
    type: String,
    required: true,
  },

  issue_days: {
    type: Number,
    required: true,
    default: 7,
  },
  issue_date: {
    type: String,
    required: true,
  },
  return_date: {
    type: String,
    required: true,
  },
  fine: {
    type: Number,
    required: true,
    default: 0,
  },

  is_return: {
    type: Boolean,
    required: true,
    default: 0,
  },
});

const issueBook = mongoose.model("issueBook", issueBookSchema);
module.exports = issueBook;
