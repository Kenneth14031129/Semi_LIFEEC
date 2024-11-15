const express = require("express");
const router = express.Router();
const {
  createMeal,
  getMeals,
  getMealById,
  deleteMeal,
  updateMeal,
} = require("../controllers/mealController");

// Routes for meal management
router.post("/add", createMeal);
router.get("/list", getMeals);
router.get("/:id", getMealById);
router.delete("/:id", deleteMeal);
router.put("/:id", updateMeal);

module.exports = router;