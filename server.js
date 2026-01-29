const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("DB Error:", err.message));

// Customer schema
const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Customer = mongoose.model("Customer", customerSchema);

// POST route
app.post("/api/customers", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const customer = new Customer({ name, phone });
    await customer.save();

    res.status(201).json({ message: "Customer saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
