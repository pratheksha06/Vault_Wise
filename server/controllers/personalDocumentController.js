
const PersonalDocument = require("../models/PersonalDocument");

// Add a personal document
const addPersonalDocument = async (req, res) => {
  try {
    const {
      documentType,
      documentName,
      documentNumber,
      issueDate,
      expiryDate,
      documentUrl,
    } = req.body;

    if (!documentType || !documentName) {
      return res.status(400).json({
        message: "Document type and document name are required",
      });
    }

    const document = await PersonalDocument.create({
      user: req.user.id,
      documentType,
      documentName,
      documentNumber: documentNumber || "",
      issueDate: issueDate || null,
      expiryDate: expiryDate || null,
      documentUrl: documentUrl || "",
    });

    res.status(201).json({
      message: "Personal document added successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add personal document",
      error: error.message,
    });
  }
};

// Get all personal documents
const getPersonalDocuments = async (req, res) => {
  try {
    const documents = await PersonalDocument.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch personal documents",
      error: error.message,
    });
  }
};

// Update a personal document
const updatePersonalDocument = async (req, res) => {
  try {
    const document = await PersonalDocument.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!document) {
      return res.status(404).json({
        message: "Personal document not found",
      });
    }

    res.status(200).json({
      message: "Personal document updated successfully",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update personal document",
      error: error.message,
    });
  }
};

// Delete a personal document
const deletePersonalDocument = async (req, res) => {
  try {
    const document = await PersonalDocument.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        message: "Personal document not found",
      });
    }

    res.status(200).json({
      message: "Personal document deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete personal document",
      error: error.message,
    });
  }
};

module.exports = {
  addPersonalDocument,
  getPersonalDocuments,
  updatePersonalDocument,
  deletePersonalDocument,
};