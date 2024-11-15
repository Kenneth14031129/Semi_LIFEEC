const express = require("express");
const router = express.Router();
const {createEmergencyAlert, getEmergencyAlerts} = require("../controllers/emergencyAlert");

// Verify that these functions exist in the `emergencyAlertController`
router.post("/", createEmergencyAlert);
router.get("/", getEmergencyAlerts);

module.exports = router;
