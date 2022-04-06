const mongoose = require("mongoose");
const fineTransactionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_date: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
});

const finetransaction = mongoose.model(
  "finetransaction",
  fineTransactionSchema
);
module.exports = finetransaction;
