const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const mealController = require("../controllers/meal.controller");

router.post(
  "/api/meal",
  authController.validateToken,
  mealController.validatemeal,
  mealController.addMeal
);

router.get("/api/meal/:mealId", mealController.getMealById);

router.get("/api/meal", mealController.getAllmeals);
router.delete(
  "/api/meal/:mealid",
  authController.validateToken,
  mealController.deleteMeal
);

module.exports = router;
