const mongoose = require('mongoose');
const { Schema } = mongoose;

// Emergency Contact Schema
const emergencyContactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
    },
    phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
        match: [/^\d{10,11}$/, 'Please provide a valid 10- or 11-digit phone number'],
    }
});

// Basic Information Schema
const basicInformationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Full name is required'],
        minlength: 3,
        maxlength: 100,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age must be at least 0'],
        max: [120, 'Age must be below 120'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'Male', 'Female'], // Adjusted enum for case-insensitive values
        required: [true, 'Gender is required'],
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        match: [/^\d{10,11}$/, 'Please provide a valid 10- or 11-digit phone number'],
    },
    emergencyContact: {
        type: emergencyContactSchema, // Use the emergencyContactSchema here
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("BasicInformation", basicInformationSchema);
