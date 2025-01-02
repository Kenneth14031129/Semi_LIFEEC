import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import "../styles/Activities.css";
import Header from "../components/Header";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";

const Activities = () => {
  const [selectedResident, setSelectedResident] = useState("");
  const [activityName, setActivityName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setError(null);
      const data = await api.get('/patient/list');
      
      if (!Array.isArray(data)) {
        throw new Error('Residents data is not an array');
      }

      console.log('Fetched residents data:', data);
      setResidents(data);
    } catch (error) {
      console.error('Error fetching residents:', error);
      setError(error.message);
      setSnackbarMessage("Error loading residents. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleResidentChange = (event) => {
    const selectedResident = event.target.value;
    console.log("Selected Resident ID:", selectedResident);
    setSelectedResident(selectedResident);
  };

  const handleActivityChange = (e) => {
    const { name, value } = e.target;
    if (name === "activityName") setActivityName(value);
    if (name === "date") setDate(value);
    if (name === "description") setDescription(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const activityData = {
      residentId: selectedResident,
      activityName,
      date,
      description,
    };

    try {
      const result = await api.post('/activities/add', activityData);
      console.log('Activity submitted successfully:', result);
      setSnackbarMessage("Activity submitted successfully!");
      setSnackbarOpen(true);

      // Clear form after submission
      setSelectedResident("");
      setActivityName("");
      setDate("");
      setDescription("");
    } catch (error) {
      console.error('Error submitting activity:', error);
      setSnackbarMessage("Error submitting activity: " + error.message);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (error) {
    return (
      <div className="activities-container">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }} className="error-container">
          <Typography variant="h6" color="error" gutterBottom>
            Error loading residents
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffffff' }}>{error}</Typography>
          <Button variant="contained" color="primary" onClick={fetchResidents} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      </div>
    );
  }

  return (
    <div className="activities-container">
      <Header />
      <Paper elevation={4} className="activities-form">
        <Typography variant="h4" gutterBottom>
          Activities
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Please select the resident and update their activity details below.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            <Box sx={{ width: "100%" }}>
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

            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
              <TextField
                fullWidth
                label="Activity Name"
                name="activityName"
                value={activityName}
                onChange={handleActivityChange}
                required
                variant="outlined"
                multiline
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                value={date}
                onChange={handleActivityChange}
                required
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={description}
                onChange={handleActivityChange}
                required
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                type="submit"
                sx={{
                  mt: 2,
                  background: 'linear-gradient(45deg, rgba(0, 31, 63, 0.8), rgba(0, 64, 128, 0.8))',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, rgba(0, 26, 53, 0.9), rgba(0, 51, 102, 0.9))',
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Activities;