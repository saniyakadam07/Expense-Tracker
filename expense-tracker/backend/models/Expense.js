const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  purpose: String,
  amount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
