const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("Mongo URI exists:", !!process.env.MONGO_URI);
console.log(
    "Mongo username:",
    process.env.MONGO_URI?.split("://")[1]?.split(":")[0]
);

const authRoutes = require("./routes/authRoutes");
const electronicsRoutes = require("./routes/electronicsRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const personalDocumentRoutes = require("./routes/personalDocumentRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/electronics", electronicsRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/personal-documents", personalDocumentRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Vault_Wise API is running 🚀"
    });
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vault_Wise server running on port ${PORT}`);
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully ✅");
    })
    .catch((error) => {
        console.error("MongoDB connection failed ❌");
        console.error(error.message);
    });