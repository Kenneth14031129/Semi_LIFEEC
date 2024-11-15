const express = require("express");
const router = express.Router();
const { getResidents, uploadInfo, getPatients} = require("../controllers/patient"); // Make sure both are imported correctly

// Define routes
router.get("/list", getResidents); // Ensure 'getResidents' is correctly imported and defined
router.post("/add", uploadInfo); // Ensure 'uploadInfo' is correctly imported and defined
router.post("/patients-per-month", getPatients);

module.exports = router;
