const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        vehicleType: {
            type: String,
            required: true,
        },

        brand: {
            type: String,
            required: true,
        },

        model: {
            type: String,
            required: true,
        },

        registrationNumber: {
            type: String,
            required: true,
        },

        purchaseDate: {
            type: Date,
            required: true,
        },

        insuranceExpiry: {
            type: Date,
            default: null,
        },

        pucExpiry: {
            type: Date,
            default: null,
        },

        rcDocumentUrl: {
            type: String,
            default: "",
        },

        insuranceDocumentUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);