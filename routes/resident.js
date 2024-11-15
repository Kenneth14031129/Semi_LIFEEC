const express = require("express");
const router = express.Router();
const {
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
} = require("../controllers/resident");

// Define routes
router.get("/list", getResidents); // Get all residents (the list endpoint)
router.get("/:id", getResidentById); // Get a single resident by ID
router.put("/:id", updateResident); // Update a resident by ID
router.delete("/:id", deleteResident); // Delete a resident by ID

module.exports = router;
