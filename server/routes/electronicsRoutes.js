const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  addElectronics,
  getElectronics,
  deleteElectronics,
  updateElectronics,
} = require("../controllers/electronicsController");

const router = express.Router();


// Add electronics record
router.post("/", protect, addElectronics);


// Get user's electronics records
router.get("/", protect, getElectronics);

// Post user's electronics records
router.delete("/:id", protect, deleteElectronics);

// Put user's electronics records
router.put("/:id", protect, updateElectronics);

module.exports = router;