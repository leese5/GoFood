const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodTruckSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  cuisine: String,
  location: {
    lat: Number,
    lng: Number
  },
  menu: [String],
  operatingHours: String,
  reviews: [String]
});

module.exports = mongoose.model('FoodTruck', FoodTruckSchema);
