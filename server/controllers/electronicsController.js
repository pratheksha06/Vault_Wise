const Electronics = require("../models/Electronics");


// Add electronics record
const addElectronics = async (req, res) => {
    try {
        const {
            deviceType,
            brand,
            model,
            serialNumber,
            purchaseDate,
            warrantyExpiry,
            invoiceUrl,
        } = req.body;

        // Validate required fields
        if (
            !deviceType ||
            !brand ||
            !model ||
            !purchaseDate ||
            !warrantyExpiry
        ) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        // Create record
        const electronics = await Electronics.create({
            user: req.user.id,
            deviceType,
            brand,
            model,
            serialNumber,
            purchaseDate,
            warrantyExpiry,
            invoiceUrl,
        });

        res.status(201).json({
            message: "Electronics record added successfully",
            electronics,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add electronics record",
        });
    }
};


// Get all electronics records of logged-in user
const getElectronics = async (req, res) => {
    try {
        const electronics = await Electronics.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            electronics,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch electronics records",
        });
    }
};


// Delete an electronics record
const deleteElectronics = async (req, res) => {
  try {
    const electronics = await Electronics.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!electronics) {
      return res.status(404).json({
        message: "Electronics record not found",
      });
    }

    res.status(200).json({
      message: "Electronics record deleted successfully",
    });
  } catch (error) {
    console.error("Delete electronics error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an electronics record
const updateElectronics = async (req, res) => {
  try {
    const electronics = await Electronics.findOneAndUpdate(
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

    if (!electronics) {
      return res.status(404).json({
        message: "Electronics record not found",
      });
    }

    res.status(200).json({
      message: "Electronics updated successfully",
      electronics,
    });
  } catch (error) {
    console.error("Update electronics error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    addElectronics,
    getElectronics,
    deleteElectronics,
    updateElectronics,
};