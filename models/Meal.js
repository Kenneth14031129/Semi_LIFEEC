const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true,
  },
  dietaryNeeds: {
    type: String,
    required: true,
  },
  nutritionalGoals: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  breakfast: {
    type: [String],
    required: true,
  },
  lunch: {
    type: [String],
    required: true,
  },
  snacks: {
    type: [String],
    required: true,
  },
  dinner: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Meal", MealSchema);