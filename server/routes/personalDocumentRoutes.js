
const express = require("express");
const router = express.Router();

const {
  addPersonalDocument,
  getPersonalDocuments,
  updatePersonalDocument,
  deletePersonalDocument,
} = require("../controllers/personalDocumentController");

const protect = require("../middleware/authMiddleware");

// Add a personal document
router.post("/", protect, addPersonalDocument);

// Get all personal documents
router.get("/", protect, getPersonalDocuments);

// Update a personal document
router.put("/:id", protect, updatePersonalDocument);

// Delete a personal document
router.delete("/:id", protect, deletePersonalDocument);

module.exports = router;