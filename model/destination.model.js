const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  place: {
    type: String,
    required: true, 
  },
  spotGroups: [
    {
      groupName: {
        type: String,
        required: true, 
      },
      price: {
        type: Number,
        required: true, 
      },
      mealIncluded: {
        type: String, 
        required: true,
      },
      spots: [
        {
          name: {
            type: String,
            required: true, 
          },
          description: {
            type: String,
            required: true, 
          },
          image: {
            type: String, 
            required: true, 
          },
        },
      ],
    },
  ],
}, {
  versionKey: false,
  timestamps: true, 
});

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
