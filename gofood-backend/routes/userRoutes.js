const express = require('express');
const router = express.Router();
const FoodTruck = require('../models/FoodTruck');

// Fetch all food trucks for a specific user
router.get('/:id/foodtrucks', async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch food trucks for the given user
    const trucks = await FoodTruck.find({ user: userId });

    // Respond with the trucks
    res.status(200).json(trucks);
  } catch (err) {
    console.error('Error fetching food trucks for user:', err.message);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

module.exports = router;
