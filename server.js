require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Check if MONGO_URI is loaded properly
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file!");
  process.exit(1);
}
console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Schema & Model
const FormDataSchema = new mongoose.Schema({
  name: String,
  phone: String,
  number: Number,
});

const FormData = mongoose.model("FormData", FormDataSchema);

// POST route to save form data
app.post("/submit", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    console.log("Received Data:", { name, email, phone });  // ✅ Logs the data
    const newEntry = new FormData({ name, email, phone });
    await newEntry.save();
    res.json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});