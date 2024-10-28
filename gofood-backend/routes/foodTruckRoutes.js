const express = require('express');
const router = express.Router();
const FoodTruck = require('../models/FoodTruck');
const auth = require('../middleware/authMiddleware');

// GET all food trucks
router.get('/', async (req, res) => {
  try {
    const trucks = await FoodTruck.find();
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// GET a single food truck by ID
router.get('/:id', async (req, res) => {
  try {
    const truck = await FoodTruck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ message: 'Food truck not found' });
    }
    res.json(truck);
  } catch (err) {
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// POST create a new food truck (only authenticated users)
router.post('/', auth, async (req, res) => {
  const { name, description, cuisine, location, menu, operatingHours, reviews } = req.body;

  // Validate required fields
  if (!name || !cuisine || !location) {
    return res.status(400).json({ message: 'Please provide all required fields: name, cuisine, and location' });
  }

  const newTruck = new FoodTruck({
    name,
    description,
    cuisine,
    location,
    menu,
    operatingHours,
    reviews,
  });

  try {
    const savedTruck = await newTruck.save();
    res.status(201).json(savedTruck);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create food truck. Please try again' });
  }
});

// PUT update a food truck by ID (only authenticated users)
router.put('/:id', auth, async (req, res) => {
  const { name, description, cuisine, location, menu, operatingHours, reviews } = req.body;

  // Check if the food truck exists
  try {
    const updatedTruck = await FoodTruck.findByIdAndUpdate(
      req.params.id,
      { name, description, cuisine, location, menu, operatingHours, reviews },
      { new: true, runValidators: true }
    );
    if (!updatedTruck) {
      return res.status(404).json({ message: 'Food truck not found' });
    }
    res.json(updatedTruck);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update food truck. Please try again' });
  }
});

// DELETE a food truck by ID (only authenticated users)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTruck = await FoodTruck.findByIdAndDelete(req.params.id);
    if (!deletedTruck) {
      return res.status(404).json({ message: 'Food truck not found' });
    }
    res.json({ message: 'Food truck deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete food truck. Please try again' });
  }
});

module.exports = router;
