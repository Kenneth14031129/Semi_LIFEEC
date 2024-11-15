const Resident = require("../models/Resident");

// Get all residents
const getResidents = async (req, res) => {
  try {
    const residents = await Resident.find();
    res.status(200).json(residents);
  } catch (error) {
    console.error("Error fetching residents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a resident by ID
const getResidentById = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json(resident);
  } catch (error) {
    console.error("Error fetching resident:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a resident
const updateResident = async (req, res) => {
  try {
    const updatedResident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedResident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json(updatedResident);
  } catch (error) {
    console.error("Error updating resident:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a resident
const deleteResident = async (req, res) => {
  try {
    const deletedResident = await Resident.findByIdAndDelete(req.params.id);
    if (!deletedResident) {
      return res.status(404).json({ message: "Resident not found" });
    }
    res.status(200).json({ message: "Resident deleted successfully" });
  } catch (error) {
    console.error("Error deleting resident:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
};
