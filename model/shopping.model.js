const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    path: String,
    description: {
      type: String,
      required: true,
    },
  });

const ShoppingItems = mongoose.model('shoppingItem', itemSchema);

module.exports = ShoppingItems;