const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/expense-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("✅ MongoDB connected"));

// Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const expenseSchema = new mongoose.Schema({
  purpose: String,
  amount: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

// Routes

// Sign up
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Sign in
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Add expense
app.post("/api/expenses", async (req, res) => {
  const { purpose, amount, userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const newExpense = new Expense({ purpose, amount, userId });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Error adding expense" });
  }
});

// Get expenses for logged-in user
app.get("/api/expenses", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Fetch expenses error:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// Update expense
app.put("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { purpose, amount } = req.body;

  try {
    const updated = await Expense.findByIdAndUpdate(
      id,
      { purpose, amount },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Error updating expense" });
  }
});

// Delete expense
app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
});

// Start server
app.listen(5000, () => {
  console.log(`🚀 Server running at http://localhost:5000`);
});
