const express = require("express");

const protect = require("../middleware/authMiddleware");


const {
    addVehicle,
    getVehicles,
    deleteVehicle,
    updateVehicle,
} = require("../controllers/vehicleController");

const router = express.Router();

// Add vehicle record
router.post("/", protect, addVehicle);

// Get user's vehicle records
router.get("/", protect, getVehicles);

// Delete a vehicle record
router.delete("/:id", protect, deleteVehicle);

// Update a vehicle record
router.put("/:id", protect, updateVehicle);

module.exports = router;