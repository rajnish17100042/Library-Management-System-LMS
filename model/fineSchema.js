const mongoose = require("mongoose");
const fineSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  fine: {
    type: Number,
    required: true,
    default: 0,
  },
});

const fine = mongoose.model("fine", fineSchema);
module.exports = fine;
