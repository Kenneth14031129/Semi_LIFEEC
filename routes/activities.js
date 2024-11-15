// routes/activities.js

const express = require('express');
const router = express.Router();
const { addActivity, getActivities, updateActivity } = require('../controllers/activities');

router.get("/list", getActivities);
router.post("/add", addActivity);
router.put("/:id", updateActivity);

module.exports = router;