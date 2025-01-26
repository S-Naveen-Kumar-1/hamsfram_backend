const Destination = require("../model/destination.model");
const mongoose = require("mongoose");

const uploadDestination = async (req, res) => {
  try {
    const { place, description, price, spotGroups } = req.body;

    const newDestination = new Destination({
      place,
      description,
      price,
      spotGroups
    });

    const savedDestination = await newDestination.save();

    return res.status(201).json({ success: true, data: savedDestination });
  } catch (error) {
    console.error("Error saving destination:", error);
    return res.status(400).json({ success: false, message: 'Error saving destination', error: error.message });
  }
};

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    return res.status(200).json({ success: true, data: destinations });
  } catch (error) {
    console.error("Error retrieving destinations:", error);
    return res.status(400).json({ success: false, message: 'Error retrieving destinations', error: error.message });
  }
};

const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    return res.status(200).json({ success: true, data: destination });
  } catch (error) {
    console.error("Error retrieving destination by ID:", error);
    return res.status(400).json({ success: false, message: 'Error retrieving destination', error: error.message });
  }
};

const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { place, description, price, spotGroups } = req.body;

    const updatedDestination = await Destination.findByIdAndUpdate(
      id,
      { place, description, price, spotGroups },
      { new: true }
    );

    if (!updatedDestination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    return res.status(200).json({ success: true, data: updatedDestination });
  } catch (error) {
    console.error("Error updating destination:", error);
    return res.status(400).json({ success: false, message: 'Error updating destination', error: error.message });
  }
};

const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDestination = await Destination.findByIdAndDelete(id);

    if (!deletedDestination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    return res.status(200).json({ success: true, message: 'Destination deleted successfully' });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return res.status(400).json({ success: false, message: 'Error deleting destination', error: error.message });
  }
};

module.exports = { uploadDestination, getAllDestinations, getDestinationById, updateDestination, deleteDestination };
