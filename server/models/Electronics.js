const mongoose = require("mongoose");

const electronicsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        deviceType: {
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

        serialNumber: {
            type: String,
            default: "",
        },

        purchaseDate: {
            type: Date,
            required: true,
        },

        warrantyExpiry: {
            type: Date,
            required: true,
        },

        invoiceUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Electronics", electronicsSchema);