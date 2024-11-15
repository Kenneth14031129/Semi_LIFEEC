const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resident',
    required: true,
  },
  activityName: {
    type: String,
    required: [true, 'Please provide activity name'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide date'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);