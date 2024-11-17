const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Customer Model
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  totalSpending: Number,
  lastVisit: Date,
  visits: Number,
});

const Customer = mongoose.model("Customer", customerSchema, "customers"); // Explicitly use the 'customers' collection

// API Endpoints
// Fetch all customers
app.get("/api/customers", async (req, res) => {
  try {
    // console.log("get request made")
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

// Add a new customer
app.post("/api/customers", async (req, res) => {
  try {
    const { name, email, totalSpending, lastVisit, visits } = req.body;
    const newCustomer = new Customer({
      name,
      email,
      totalSpending,
      lastVisit,
      visits,
    });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error adding customer:", error.message);
    res.status(500).json({ message: "Failed to add customer" });
  }
});

// Delete a customer by ID
app.delete("/api/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    res.status(500).json({ message: "Failed to delete customer" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
