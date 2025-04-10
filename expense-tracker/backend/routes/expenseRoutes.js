const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Add a new expense
router.post("/", async (req, res) => {
  try {
    const { purpose, amount } = req.body;

    // Validate input
    if (!purpose || !amount) {
      return res
        .status(400)
        .json({ message: "Purpose and amount are required" });
    }

    const newExpense = new Expense({
      purpose,
      amount,
      createdAt: Date.now(), // optional, since schema has default
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error saving expense:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
