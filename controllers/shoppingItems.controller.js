
const Item=require('../model/shopping.model');
const uploadShoppingItem = async (req, res) => {
    try {
      const newItem = new Item(req.body);
      const savedItem = await newItem.save();
      res.status(201).json({ success: true, data: savedItem });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error saving item', error: error.message });
    }
  };
  
  const getAllShoppingItems = async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error retrieving items', error: error.message });
    }
  };
  
  const getShoppingItemById = async (req, res) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error retrieving item', error: error.message });
    }
  };
  
  const updateShoppingItem = async (req, res) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ success: false, message: 'Item not found' });
      res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error updating item', error: error.message });
    }
  };
  
  const deleteShoppingItem = async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ success: false, message: 'Item not found' });
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Error deleting item', error: error.message });
    }
  };
  module.exports = { uploadShoppingItem, getAllShoppingItems, getShoppingItemById, updateShoppingItem, deleteShoppingItem };
