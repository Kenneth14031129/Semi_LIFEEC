// routes/dashboard.js

const express = require('express');
const router = express.Router();
const { getPatients } = require('../controllers/patient');

// Define your dashboard-specific routes here
router.get('/', getPatients); // Assuming the dashboard shows patient statistics

module.exports = router;
