import React, { useState, useEffect } from 'react';
import "../styles/HealthGoals.css";
import Header from "../components/Header";
import { api } from "../api/api";
import {
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

const allAllergies = [
  "Peanuts", "Tree Nuts", "Milk", "Eggs", "Wheat", "Soy", "Fish", "Shellfish",
  "Pollen", "Dust Mites", "Insect Stings", "Latex", "Mold", "Animal Dander",
  "Certain Medications", "Fragrance", "Nickel", "Gluten", "Citrus Fruits",
  "Chocolate", "Corn", "Red Dye #40", "Sesame", "Sunlight", "Caffeine",
  "Alcohol"
];

const AllmedicalCondition = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Chronic Kidney Disease",
  "Arthritis",
  "COPD",
  "Obesity",
  "High Cholesterol",
  "Alzheimer's Disease",
  "Cancer",
  "Depression",
  "Anxiety",
  "Stroke",
  "Epilepsy"
];

const HealthManagement = () => {
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState('');
  const [selectedAllergy, setSelectedAllergy] = useState('');
  const [healthProgress, setHealthProgress] = useState({
    medicalCondition: "",
    date: new Date().toISOString().split('T')[0],
    status: "",
  });

  const [medication, setMedication] = useState({
    currentMedication: "",
    dosage: "",
    quantity: "",
  });

  const [medicationSchedule, setMedicationSchedule] = useState({
    medication: "",
    time: "",
    taken: false,
  });

  const [carePlans, setCarePlans] = useState({
    healthAssessment: "",
    administrationInstruction: "",
  });

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const data = await api.get('/patient/list');
        setResidents(data);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };

    fetchResidents();
  }, []);

  const handleResidentChange = (event) => {
    const selectedResident = event.target.value;
    console.log("Selected Resident ID:", selectedResident);
    setSelectedResident(selectedResident);
  };

  const handleAllergyChange = (e) => setSelectedAllergy(e.target.value);

  const handleHealthProgressChange = (e) => {
    const { name, value } = e.target;
    setHealthProgress((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleMedicationChange = (e) => {
    const { name, value } = e.target;
    setMedication((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setMedicationSchedule((prevState) => ({
      ...prevState,
      [name]: name === "taken" ? value === "Yes" : value,
    }));
  };  

  const handleCarePlansChange = (e) => {
    const { name, value } = e.target;
    setCarePlans((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedResident) {
        alert("Please select a resident.");
        return;
      }

      const healthProgressData = {
        residentId: selectedResident,
        allergy: selectedAllergy,
        medicalCondition: healthProgress.medicalCondition,
        date: healthProgress.date,
        status: healthProgress.status,
        currentMedication: medication.currentMedication,
        dosage: medication.dosage,
        quantity: medication.quantity,
        medication: medicationSchedule.medication,
        time: medicationSchedule.time,
        taken: medicationSchedule.taken,
        healthAssessment: carePlans.healthAssessment,
        administrationInstruction: carePlans.administrationInstruction,
      };

      console.log("Submitting health progress data:", healthProgressData);

      const responseData = await api.post('/health-progress/add', healthProgressData);
      console.log("Full server response:", responseData);

      alert("Health record created successfully!");

      // Optionally clear the form here
      setSelectedResident("");
      setSelectedAllergy("");
      setHealthProgress({
        medicalCondition: "",
        date: new Date().toISOString().split('T')[0],
        status: "",
      });
      setMedication({
        currentMedication: "",
        dosage: "",
        quantity: "",
      });
      setMedicationSchedule({
        medication: "",
        time: "",
        taken: false,
      });
      setCarePlans({
        healthAssessment: "",
        administrationInstruction: "",
      });
      
    } catch (error) {
      console.error("Error submitting health data:", error);
      alert(`An error occurred while submitting health information: ${error.message}`);
    }
  };

  return (
    <div className="health-management-container">
      <Header />
      <Paper elevation={4} className="health-info-form">
        <Typography variant="h4" gutterBottom>
          Health Management
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Please select the resident and update their health details below.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Resident Selection */}
            <Box sx={{ width: '100%' }}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="resident-label">Select Resident</InputLabel>
                <Select
                  value={selectedResident || ''}
                  onChange={handleResidentChange}
                  label="Select Resident"
                >
                  {residents.length > 0 ? (
                    residents.map((resident) => (
                      <MenuItem key={resident._id} value={resident._id}>
                        {resident.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Loading residents...
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

            {/* Section 1: Health Progress */}
            <Typography variant="h6">Health Progress</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Allergies */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="allergy-label">Allergy</InputLabel>
                  <Select
                    labelId="allergy-label"
                    value={selectedAllergy}
                    onChange={handleAllergyChange}
                    label="Allergy"
                  >
                    {allAllergies.map((allergy) => (
                      <MenuItem key={allergy} value={allergy}>
                        {allergy}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Medical Condition */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="medical-condition-label">Medical Condition</InputLabel>
                  <Select
                    labelId="medical-condition-label"
                    value={healthProgress.medicalCondition}
                    onChange={handleHealthProgressChange}
                    label="Medical Condition"
                    name="medicalCondition"
                  >
                    {AllmedicalCondition.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Date */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Date"
                  value={healthProgress.date}
                  onChange={handleHealthProgressChange}
                  name="date"
                  required
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Status */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Status"
                  value={healthProgress.status}
                  onChange={handleHealthProgressChange}
                  name="status"
                  required
                  variant="outlined"
                  select
                >
                  <MenuItem value="stable">Stable</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="improving">Improving</MenuItem>
                  <MenuItem value="declining">Declining</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* Section 2: Medications */}
            <Typography variant="h6">Medications</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Current Medication */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Current Medication"
                  value={medication.currentMedication}
                  onChange={handleMedicationChange}
                  name="currentMedication"
                  required
                  variant="outlined"
                  multiline
                />
              </Box>

              {/* Dosage */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Dosage"
                  value={medication.dosage}
                  onChange={handleMedicationChange}
                  name="dosage"
                  required
                  variant="outlined"
                  multiline
                />
              </Box>

              {/* Quantity */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={medication.quantity}
                  onChange={handleMedicationChange}
                  name="quantity"
                  required
                  variant="outlined"
                  type="number"
                />
              </Box>
            </Box>

            {/* Section 3: Medication Schedule */}
            <Typography variant="h6">Medication Schedule</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Medication */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Medication"
                  value={medicationSchedule.medication}
                  onChange={handleScheduleChange}
                  name="medication"
                  required
                  variant="outlined"
                  multiline
                />
              </Box>

              {/* Time */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Time"
                  value={medicationSchedule.time}
                  onChange={handleScheduleChange}
                  name="time"
                  required
                  variant="outlined"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Taken */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="taken-label">Taken</InputLabel>
                  <Select
                    labelId="taken-label"
                    value={medicationSchedule.taken ? "Yes" : "No"}
                    onChange={handleScheduleChange}
                    label="Taken"
                    name="taken"
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Section 4: Care Plans */}
            <Typography variant="h6">Care Plans</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Health Assessment */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Health Assessment"
                  value={carePlans.healthAssessment}
                  onChange={handleCarePlansChange}
                  name="healthAssessment"
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Box>

              {/* Administration Instruction */}
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  label="Administration Instruction"
                  value={carePlans.administrationInstruction}
                  onChange={handleCarePlansChange}
                  name="administrationInstruction"
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ width: '100%' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default HealthManagement;