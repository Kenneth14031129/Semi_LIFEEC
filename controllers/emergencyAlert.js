const EmergencyAlert = require("../models/EmergencyAlert");

exports.createEmergencyAlert = async (req, res) => {
  try {
    const { residentId, message, timestamp } = req.body;
    console.log("Request to create alert received:", req.body);

    if (!residentId) {
      console.log("Missing resident ID");
      return res.status(400).json({ message: "Resident ID is required" });
    }

    const newAlert = new EmergencyAlert({
      residentId,
      message: message || "Emergency alert triggered",
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
    const alerts = await EmergencyAlert.find(); // Modify as needed to match your database structure
    
    console.log("Fetched alerts:", alerts);
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    console.error("Error fetching emergency alerts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
