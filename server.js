const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Load environment variables
require("dotenv").config({ path: __dirname + "/.env" });

// Debug check (keep for now)
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("DB Error:", err.message);
  });

// =======================
// Customer Schema
// =======================
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

// =======================
// Routes
// =======================

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Save customer data
app.post("/api/customers", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const newCustomer = new Customer({ name, phone });
    await newCustomer.save();

    res.status(201).json({
      message: "Customer saved successfully",
      data: newCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all customers
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =======================
// Server Start
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
