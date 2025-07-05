import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

const Expenses = () => {
  const [formData, setFormData] = useState({ purpose: "", amount: "" });
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  const fetchExpenses = async () => {
    if (!userId) return;

    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        params: { userId },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;
      try {
        const res = await axios.get("http://localhost:5000/api/expenses", {
          params: { userId },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };

    fetchExpenses();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.purpose || !formData.amount || isNaN(formData.amount)) {
      alert("Please enter valid details.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/expenses/${editingId}`, {
          ...formData,
          amount: parseFloat(formData.amount),
        });
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/expenses", {
          ...formData,
          amount: parseFloat(formData.amount),
          userId,
        });
      }

      setFormData({ purpose: "", amount: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Error submitting expense:", err);
    }
  };

  const handleEdit = (expense) => {
    setFormData({ purpose: expense.purpose, amount: expense.amount });
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ purpose: "", amount: "" });
  };

  return (
    <div className="form-container">
      <h2>{editingId ? "Edit Expense" : "Add New Expense"}</h2>
      <form onSubmit={handleSubmit} className="form-box">
        <input
          type="text"
          name="purpose"
          placeholder="Expense Purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount in ₹"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
        />
        {!editingId && (
          <button type="submit" className="add-btn">
            Add Expense
          </button>
        )}
        {editingId && (
          <div className="edit-actions">
            <button type="submit" className="update-btn">
              Update
            </button>
            <button type="button" onClick={cancelEdit} className="cancel-btn">
              Cancel
            </button>
          </div>
        )}
      </form>

      {userId ? (
        <>
          <h3 className="expenses-title">Your Expenses</h3>
          <ul className="expense-list">
            {expenses.map((exp) => (
              <li key={exp._id}>
                <strong>{exp.purpose}</strong> - ₹{exp.amount}
                <br />
                <small>{new Date(exp.createdAt).toLocaleString()}</small>
                <div className="expense-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(exp)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(exp._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Please sign in to view and manage expenses.</p>
      )}
    </div>
  );
};

export default Expenses;
