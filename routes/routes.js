const express = require("express");
const { uploadDestination, getDestinationById, getAllDestinations, updateDestination, deleteDestination } = require("../controllers/destination.controller");
const { uploadHotel, getAllHotels, getHotelById, updateHotel, deleteHotel } = require("../controllers/hotels.controller");

const router = express.Router();

router.post('/destinations', uploadDestination);
router.get('/destinations', getAllDestinations);
router.get('/destinations/:id', getDestinationById);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);
router.post('/hotels', uploadHotel);
router.get('/hotels',getAllHotels);
router.get('/hotels/:id', getHotelById);
router.put('/hotels/:id', updateHotel);
router.delete('/hotels/:id', deleteHotel);



module.exports = router;