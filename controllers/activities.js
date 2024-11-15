// controllers/activities.js
const Activity = require('../models/Activity');

const addActivity = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { residentId, activityName, date, description } = req.body;
    
    // Validate input
    if (!residentId || !activityName || !date || !description) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const activity = await Activity.create({ residentId, activityName, date, description });
    console.log('Activity created:', activity);
    res.status(201).json({ activity });
  } catch (error) {
    console.error('Error in addActivity:', error);
    res.status(500).json({ msg: 'Error adding activity', error: error.message, stack: error.stack });
  }
};

const getActivities = async (req, res) => {
  try {
    // Fetch activities from the database
    const activities = await Activity.find();
    res.status(200).json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Error fetching activities", error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { activityName, date, description } = req.body;

    // Validate input
    if (!activityName || !date || !description) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { activityName, date, description },
      { new: true, runValidators: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    res.status(200).json({ activity: updatedActivity });
  } catch (error) {
    console.error('Error in updateActivity:', error);
    res.status(500).json({ msg: 'Error updating activity', error: error.message });
  }
};

module.exports = {
  addActivity,
  getActivities,
  updateActivity,
};

