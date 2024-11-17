const EmergencyAlert = require("../models/EmergencyAlert");

exports.createEmergencyAlert = async (req, res) => {
  try {
    const { residentId, residentName, message, timestamp } = req.body;
    console.log("Request to create alert received:", req.body);

    if (!residentId || !residentName) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Resident ID and name are required" });
    }

    const newAlert = new EmergencyAlert({
      residentId,
      residentName,
      message: message || `Emergency alert triggered for ${residentName}`,
      timestamp: timestamp || Date.now(),
    });

    await newAlert.save();
    console.log("New alert created:", newAlert);

    res.status(201).json({
      message: "Emergency alert created successfully",
      data: newAlert,
    });
  } catch (error) {
    console.error("Error creating emergency alert:", error);
    res.status(500).json({
      message: "Failed to create emergency alert",
      error: error.message,
    });
  }
};

exports.getEmergencyAlerts = async (req, res) => {
  try {
    console.log("Request to fetch all emergency alerts received");
    const alerts = await EmergencyAlert.find().sort({ timestamp: -1 }); // Added sorting by timestamp
    
    console.log("Fetched alerts:", alerts);
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    console.error("Error fetching emergency alerts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
