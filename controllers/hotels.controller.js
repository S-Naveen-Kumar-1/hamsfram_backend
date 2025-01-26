// controllers/hotelController.js

const Hotel = require('../model/hotel.model');

// Upload a new hotel
const uploadHotel = async (req, res) => {
  try {
    const { name, images, price, features, destination } = req.body;

    const newHotel = new Hotel({
      name,
      images,
      price,
      features,
      destination,
    });

    const savedHotel = await newHotel.save();

    return res.status(201).json({ success: true, data: savedHotel });
  } catch (error) {
    console.error("Error saving hotel:", error);
    return res.status(400).json({ success: false, message: 'Error saving hotel', error: error.message });
  }
};

// Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    return res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    console.error("Error retrieving hotels:", error);
    return res.status(400).json({ success: false, message: 'Error retrieving hotels', error: error.message });
  }
};

// Get hotel by ID
const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    return res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    console.error("Error retrieving hotel by ID:", error);
    return res.status(400).json({ success: false, message: 'Error retrieving hotel', error: error.message });
  }
};

// Update hotel by ID
const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, images, price, features, destination } = req.body;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { name, images, price, features, destination },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    return res.status(200).json({ success: true, data: updatedHotel });
  } catch (error) {
    console.error("Error updating hotel:", error);
    return res.status(400).json({ success: false, message: 'Error updating hotel', error: error.message });
  }
};

// Delete hotel by ID
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHotel = await Hotel.findByIdAndDelete(id);

    if (!deletedHotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    return res.status(200).json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return res.status(400).json({ success: false, message: 'Error deleting hotel', error: error.message });
  }
};

module.exports = { uploadHotel, getAllHotels, getHotelById, updateHotel, deleteHotel };
