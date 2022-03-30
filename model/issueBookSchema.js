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
  },
  issue_date: {
    type: string,
    required: true,
  },
  return_date: {
    type: string,
    required: true,
  },
  fine: {
    type: Number,
    required: true,
  },

  is_return: {
    type: Boolean,
    required: true,
    default: 0,
  },
});

const isseuBook = mongoose.model("issueBook", issueBookSchema);
module.exports = issueBook;
