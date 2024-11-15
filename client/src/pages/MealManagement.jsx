// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import "../styles/Meal.css";
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
  Chip,
} from "@mui/material";

const MealManagement = () => {
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState("");
  const [dietaryNeeds, setDietaryNeeds] = useState("");
  const [nutritionalGoals, setNutritionalGoals] = useState("");
  const [date, setDate] = useState("");
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const foodOptions = [
    "Apple",
    "Banana",
    "Carrots",
    "Oatmeal",
    "Chicken",
    "Salad",
    "Rice",
    "Pasta",
  ];

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/patient/list`);
        const data = await response.json();
        setResidents(data);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };

    fetchResidents();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedResident ||
      !dietaryNeeds ||
      !nutritionalGoals ||
      !date ||
      breakfast.length === 0 ||
      lunch.length === 0 ||
      snacks.length === 0 ||
      dinner.length === 0
    ) {
      setSnackbarMessage("Please fill out all required fields.");
      setSnackbarOpen(true);
      return;
    }
  
    const mealData = {
      residentId: selectedResident,
      dietaryNeeds,
      nutritionalGoals,
      date,
      breakfast,
      lunch,
      snacks,
      dinner,
    };
  
    console.log("Sending meal data:", JSON.stringify(mealData, null, 2));
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/meal/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData.error || response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log('Meal submitted successfully:', responseData);
  
      setSnackbarMessage(`Meal Management Information Submitted for Resident ID: ${selectedResident}!`);
      setSnackbarOpen(true);
  
      // Clear form after submission
      setSelectedResident("");
      setDietaryNeeds("");
      setNutritionalGoals("");
      setDate("");
      setBreakfast([]);
      setLunch([]);
      setSnacks([]);
      setDinner([]);
    } catch (error) {
      console.error('Error submitting meal data:', error);
      setSnackbarMessage(`Error submitting meal data: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleResidentChange = (event) => {
    setSelectedResident(event.target.value);
    const selected = residents.find((resident) => resident._id === event.target.value);
    if (selected) {
      setDietaryNeeds(selected.dietaryNeeds || '');
      setNutritionalGoals(selected.nutritionalGoals || '');
    }
  };

  const handleMealChange = (meal, value) => {
    switch (meal) {
      case 'breakfast':
        setBreakfast(value);
        break;
      case 'lunch':
        setLunch(value);
        break;
      case 'snacks':
        setSnacks(value);
        break;
      case 'dinner':
        setDinner(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="meal-management-container">
      <Header />
      <Paper elevation={4} className="meal-form">
        <Typography variant="h4" gutterBottom>
          Meal Management
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          Please select the resident and update their meal details below.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Resident Selection */}
            <Box sx={{ width: "100%" }}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="resident-label">Select Resident</InputLabel>
                <Select
                  labelId="resident-label"
                  value={selectedResident}
                  onChange={handleResidentChange}
                  label="Select Resident"
                >
                  {residents.map((resident) => (
                    <MenuItem key={resident._id} value={resident._id}>
                      {resident.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Dietary Needs and Nutritional Goals side by side */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {/* Dietary Needs */}
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  fullWidth
                  label="Dietary Needs"
                  value={dietaryNeeds}
                  onChange={(e) => setDietaryNeeds(e.target.value)}
                  required
                  variant="outlined"
                  type="text"
                />
              </Box>

              {/* Nutritional Goals */}
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  fullWidth
                  label="Nutritional Goals"
                  value={nutritionalGoals}
                  onChange={(e) => setNutritionalGoals(e.target.value)}
                  required
                  variant="outlined"
                  type="text"
                />
              </Box>
            </Box>

            {/* Section 1: Meals */}
            <Typography variant="h6">Meals</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {/* Date */}
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <TextField
                  fullWidth
                  label="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  variant="outlined"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>

              {/* Breakfast */}
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="breakfast-label">Breakfast</InputLabel>
                  <Select
                    labelId="breakfast-label"
                    multiple
                    value={breakfast}
                    onChange={(e) => handleMealChange('breakfast', e.target.value)}
                    label="Breakfast"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {foodOptions.map((food) => (
                      <MenuItem key={food} value={food}>
                        {food}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Lunch */}
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="lunch-label">Lunch</InputLabel>
                  <Select
                    labelId="lunch-label"
                    multiple
                    value={lunch}
                    onChange={(e) => handleMealChange('lunch', e.target.value)}
                    label="Lunch"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {foodOptions.map((food) => (
                      <MenuItem key={food} value={food}>
                        {food}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Snacks */}
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="snacks-label">Snacks</InputLabel>
                  <Select
                    labelId="snacks-label"
                    multiple
                    value={snacks}
                    onChange={(e) => handleMealChange('snacks', e.target.value)}
                    label="Snacks"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {foodOptions.map((food) => (
                      <MenuItem key={food} value={food}>
                        {food}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Dinner */}
              <Box sx={{ width: { xs: "100%", sm: "48%" } }}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="dinner-label">Dinner</InputLabel>
                  <Select
                    labelId="dinner-label"
                    multiple
                    value={dinner}
                    onChange={(e) => handleMealChange('dinner', e.target.value)}
                    label="Dinner"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {foodOptions.map((food) => (
                      <MenuItem key={food} value={food}>
                        {food}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ width: "100%" }}>
              <Button fullWidth variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default MealManagement;