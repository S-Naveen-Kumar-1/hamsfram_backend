// models/Hotel.js

const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  destination: {
    type: String,
    required: true,
  },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
