import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import "../styles/BasicInformation.css";
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

function BasicInformation() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState(""); // New state for emergency email

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      name,
      age,
      gender,
      contact,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      emergencyContactEmail: emergencyEmail, // Include email in form data
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/patient/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} ${errorText}`
        );
      }
  
      const newResident = await response.json();
      console.log("New Resident added:", newResident);
  
      alert("Resident added successfully!");
      navigate("/residentList");
  
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data: " + error.message);
    }
  };  

  const handleEmergencyContactChange = (e, field) => {
    const { value } = e.target;

    if (field === "name") setEmergencyName(value);
    if (field === "phone") setEmergencyPhone(value);
    if (field === "email") setEmergencyEmail(value); // Handle email input change
  };

  return (
    <div className="basic-information-component">
      <Header />
      <Paper elevation={4} className="basic-info-form">
        <Typography variant="h4" gutterBottom>
          Basic Information
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Please fill in the resident details below.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Full Name */}
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
            </Box>

            {/* Age */}
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                variant="outlined"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
            </Box>

            {/* Gender Dropdown */}
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  label="Gender"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Contact Number */}
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
            </Box>

            {/* Emergency Contact Section */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" className="emergency-section">
                Emergency Contact
              </Typography>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                value={emergencyName}
                onChange={(e) => handleEmergencyContactChange(e, "name")}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                value={emergencyPhone}
                onChange={(e) => handleEmergencyContactChange(e, "phone")}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                fullWidth
                label="Emergency Contact Email" // New email field
                value={emergencyEmail}
                onChange={(e) => handleEmergencyContactChange(e, "email")}
                variant="outlined"
                type="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ width: '100%' }}>
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
    </div>
  );
}

export default BasicInformation;
