// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'health_emergency' },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
