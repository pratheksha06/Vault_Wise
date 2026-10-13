const Vehicle = require("../models/Vehicle");

// Add vehicle record
const addVehicle = async (req, res) => {
    try {
        const {
            vehicleType,
            brand,
            model,
            registrationNumber,
            purchaseDate,
            insuranceExpiry,
            pucExpiry,
            rcDocumentUrl,
            insuranceDocumentUrl,
        } = req.body;

        // Validate required fields
        if (
            !vehicleType ||
            !brand ||
            !model ||
            !registrationNumber ||
            !purchaseDate
        ) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        // Create vehicle record
        const vehicle = await Vehicle.create({
            user: req.user.id,
            vehicleType,
            brand,
            model,
            registrationNumber,
            purchaseDate,
            insuranceExpiry: insuranceExpiry || null,
            pucExpiry: pucExpiry || null,
            rcDocumentUrl,
            insuranceDocumentUrl,
        });

        res.status(201).json({
            message: "Vehicle record added successfully",
            vehicle,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add vehicle record",
        });
    }
};

// Get all vehicles of logged-in user
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            vehicles,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch vehicle records",
        });
    }
};

// Delete a vehicle record
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle record not found",
            });
        }

        res.status(200).json({
            message: "Vehicle record deleted successfully",
        });
    } catch (error) {
        console.error("Delete vehicle error:", error.message);

        res.status(500).json({
            message: "Server error",
        });
    }
};

// Update a vehicle record
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndUpdate(
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

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle record not found",
            });
        }

        res.status(200).json({
            message: "Vehicle record updated successfully",
            vehicle,
        });
    } catch (error) {
        console.error("Update vehicle error:", error.message);

        res.status(500).json({
            message: "Server error",
        });
    }
};

module.exports = {
    addVehicle,
    getVehicles,
    deleteVehicle,
    updateVehicle,
};