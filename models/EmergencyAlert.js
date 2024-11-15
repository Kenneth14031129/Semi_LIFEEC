// models/EmergencyAlert.js
const mongoose = require("mongoose");

const EmergencyAlertSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident", // Reference to Resident model (if exists)
    required: true,
  },
  message: {
    type: String,
    required: true,
    default: "Emergency alert triggered",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("EmergencyAlert", EmergencyAlertSchema);
