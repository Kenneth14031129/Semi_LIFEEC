const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for emergency contact
const emergencyContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

// Schema for health management
const healthManagementSchema = new Schema({
  allergies: String,
  medicalCondition: String,
  date: Date,
  status: String,
  currentMedication: {
    name: String,
    dosage: String,
    quantity: Number,
    medicationSchedule: [
      {
        medication: String,
        time: String,
        taken: Boolean,
      },
    ],
  },
  healthAssessment: String,
  administrationInstruction: String,
});

// Schema for meal management
const mealManagementSchema = new Schema({
  dietaryNeeds: String,
  nutritionalGoals: String,
  meals: [
    {
      date: Date,
      breakfast: String,
      lunch: String,
      snacks: String,
      dinner: String,
    },
  ],
});

// Schema for activities
const activitySchema = new Schema({
  name: String,
  date: Date,
  description: String,
});

// Main Resident Schema
const residentSchema = new Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    emergencyContact: emergencyContactSchema,
    healthManagement: healthManagementSchema,
    mealManagement: mealManagementSchema,
    activities: [activitySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resident", residentSchema);
