const mongoose = require('mongoose');
const HealthProgress = require('../models/HealthProgress');

// @desc    Get all health progress entries
// @route   GET /api/v1/health-progress
// @access  Public
const getHealthProgress = async (req, res) => {
  try {
    const patients = await HealthProgress.find(); // Assuming you're using BasicInformation model
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching residents", error });
  }
}

// @desc    Get a specific health progress by ID
// @route   GET /api/v1/health-progress/:id
// @access  Public
const getHealthProgressById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid health progress ID" });
    }

    const healthProgress = await HealthProgress.findById(id).populate('residentId');
    if (!healthProgress) {
      return res.status(404).json({ message: "Health progress not found" });
    }
    res.status(200).json(healthProgress);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving health progress", error });
  }
};

// @desc    Create a new health progress entry
// @route   POST /api/v1/health-progress
// @access  Public
const uploadHealthProgress = async (req, res) => {
  console.log('Request received for creating health progress:', req.body);
  
  try {
    const { 
      residentId, 
      allergy,
      medicalCondition, 
      date,
      status,
      currentMedication,
      dosage,
      quantity,
      medication,
      time,
      taken,
      healthAssessment,
      administrationInstruction
    } = req.body;

    // Validate required fields
    if (!residentId || !medicalCondition || !status) {
      console.log('Missing required fields:', { residentId, medicalCondition, status });
      return res.status(400).json({ 
        message: "Missing required fields", 
        missingFields: { 
          residentId: !residentId, 
          medicalCondition: !medicalCondition, 
          status: !status 
        } 
      });
    }

    // Create new health progress entry
    const newHealthProgress = new HealthProgress({
      residentId,
      allergy,
      medicalCondition,
      date: date || new Date(),
      status,
      currentMedication,
      dosage,
      quantity: parseInt(quantity, 10), // Ensure quantity is saved as a number
      medication,
      time,
      taken: Boolean(taken), // Ensure taken is saved as a boolean
      healthAssessment,
      administrationInstruction
    });

    // Save to database
    const savedHealthProgress = await newHealthProgress.save();
    
    // Send success response
    res.status(201).json({
      message: "Health progress created successfully",
      data: savedHealthProgress
    });

  } catch (error) {
    console.error("Error creating health progress:", error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry error",
        error: "A health progress entry with this information already exists"
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      message: "Error creating health progress", 
      error: error.message 
    });
  }
};

// @desc    Delete a health progress entry
// @route   DELETE /api/v1/health-progress/:id
// @access  Public
const deleteHealthProgress = async (req, res) => {
  try {
    const healthProgress = await HealthProgress.findByIdAndDelete(req.params.id);
    
    if (!healthProgress) {
      return res.status(404).json({ message: "Health progress not found" });
    }

    res.status(200).json({ message: "Health progress deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting health progress", error });
  }
};

const updateHealthProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Updating health progress for id:', id);
    console.log('Update data:', updateData);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid health progress ID" });
    }

    // Validate required fields
    if (!updateData.medicalCondition || !updateData.status) {
      return res.status(400).json({ 
        message: "Missing required fields", 
        missingFields: { 
          medicalCondition: !updateData.medicalCondition, 
          status: !updateData.status 
        } 
      });
    }

    const updatedHealthProgress = await HealthProgress.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedHealthProgress) {
      return res.status(404).json({ message: "Health progress not found" });
    }

    console.log('Health progress updated successfully:', updatedHealthProgress);

    res.status(200).json({
      message: "Health progress updated successfully",
      data: updatedHealthProgress
    });
  } catch (error) {
    console.error("Error updating health progress:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation error", 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: "Error updating health progress", 
      error: error.message 
    });
  }
};

module.exports = {
  getHealthProgress,
  getHealthProgressById,
  uploadHealthProgress,
  deleteHealthProgress,
  updateHealthProgress,
};
