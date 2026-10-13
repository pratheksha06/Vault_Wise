
const mongoose = require("mongoose");

const personalDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      required: true,
      enum: [
        "Aadhaar Card",
        "PAN Card",
        "Passport",
        "Driving License",
        "Voter ID",
        "College ID",
        "Employee ID",
        "Other",
      ],
    },

    documentName: {
      type: String,
      required: true,
      trim: true,
    },

    documentNumber: {
      type: String,
      default: "",
    },

    issueDate: {
      type: Date,
      default: null,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    documentUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PersonalDocument",
  personalDocumentSchema
);