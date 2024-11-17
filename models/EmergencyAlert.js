const mongoose = require("mongoose");

const EmergencyAlertSchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true,
  },
  residentName: {
    type: String,
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