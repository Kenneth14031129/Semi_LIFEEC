const mongoose = require('mongoose');

const healthProgressSchema = new mongoose.Schema({
  residentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resident', 
    required: true
  },
  allergy: { type: String },
  medicalCondition: { type: String, required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['stable', 'critical', 'improving', 'declining'],
    required: true 
  },
  currentMedication: { type: String },
  dosage: { type: String },
  quantity: { type: Number },
  medication: { type: String },
  time: { type: String },
  taken: { type: Boolean, default: false },
  healthAssessment: { type: String },
  administrationInstruction: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HealthProgress', healthProgressSchema);