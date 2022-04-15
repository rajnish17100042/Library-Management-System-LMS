const mongoose = require("mongoose");
const fineHistorySchema = new mongoose.Schema({
  issue_by: {
    type: String,
    required: true,
  },
  book_id: {
    type: String,
    required: true,
  },

  issue_date: {
    type: String,
    required: true,
  },
  actual_return_date: {
    type: String,
    required: true,
  },
  user_return_date: {
    type: String,
    required: true,
  },
  fine: {
    type: Number,
    required: true,
  },
});

const fineHistory = mongoose.model("fineHistory", fineHistorySchema);
module.exports = fineHistory;
