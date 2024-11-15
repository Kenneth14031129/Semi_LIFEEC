const Meal = require("../models/Meal");

const createMeal = async (req, res) => {
    try {
      console.log('Received meal data:', JSON.stringify(req.body, null, 2));
      const { residentId, dietaryNeeds, nutritionalGoals, date, breakfast, lunch, snacks, dinner } = req.body;
      
      // Validate input
      if (!residentId || !dietaryNeeds || !nutritionalGoals || !date || !breakfast || !lunch || !snacks || !dinner) {
        return res.status(400).json({ msg: 'All fields are required' });
      }
  
      const meal = await Meal.create({ 
        residentId, 
        dietaryNeeds, 
        nutritionalGoals, 
        date, 
        breakfast, 
        lunch, 
        snacks, 
        dinner 
      });
      console.log('Meal created:', meal);
      res.status(201).json({ meal });
    } catch (error) {
      console.error('Error in createMeal:', error);
      res.status(500).json({ msg: 'Error creating meal', error: error.message, stack: error.stack });
    }
  };

  const getMeals = async (req, res) => {
    try {
      const patients = await Meal.find(); // Assuming you're using BasicInformation model
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching residents", error });
    }
  }

// Get a meal by ID
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate("residentId");
    if (!meal) {
      return res.status(404).json({ success: false, error: "Meal not found" });
    }
    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a meal entry
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) {
      return res.status(404).json({ success: false, error: "Meal not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { dietaryNeeds, nutritionalGoals, date, breakfast, lunch, snacks, dinner } = req.body;

    // Validate input
    if (!dietaryNeeds || !nutritionalGoals || !date || !breakfast || !lunch || !snacks || !dinner) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { 
        dietaryNeeds, 
        nutritionalGoals, 
        date, 
        breakfast, 
        lunch, 
        snacks, 
        dinner 
      },
      { new: true, runValidators: true }
    );

    if (!updatedMeal) {
      return res.status(404).json({ msg: 'Meal not found' });
    }

    res.status(200).json({ meal: updatedMeal });
  } catch (error) {
    console.error('Error in updateMeal:', error);
    res.status(500).json({ msg: 'Error updating meal', error: error.message });
  }
};

module.exports = {
  createMeal,
  getMeals,
  getMealById,
  deleteMeal,
  updateMeal,
};