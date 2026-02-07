const express = require("express");
const { uploadDestination, getDestinationById, getAllDestinations, updateDestination, deleteDestination } = require("../controllers/destination.controller");
const { uploadHotel, getAllHotels, getHotelById, updateHotel, deleteHotel } = require("../controllers/hotels.controller");
const { uploadShoppingItem, getAllShoppingItems, getShoppingItemById, updateShoppingItem, deleteShoppingItem } = require("../controllers/shoppingItems.controller");
const { testAPi, joinMeeting, leaveMeeting, roomDestroyed, roomCreated, getAllMeetings } = require("../controllers/studentDetails.controller");
const { getJITSIJWT } = require("../controllers/jitsiJWT.controller");
const { uploadBlog, getAllBlogs, getBlogById, addComment, deleteComment, likeBlog } = require("../controllers/blogController");

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

router.post('/shoppingItems', uploadShoppingItem);
router.get('/shoppingItems', getAllShoppingItems);
router.get('/shoppingItems/:id', getShoppingItemById);
router.put('/shoppingItems/:id', updateShoppingItem);
router.delete('/shoppingItems/:id', deleteShoppingItem);

router.post("/testAPi",testAPi)

router.post('/blogs', uploadBlog);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);

// COMMENTS
router.post('/blogs/:id/comments', addComment);
router.delete('/blogs/:blogId/comments/:commentIndex', deleteComment);

router.post("/blogs/:id/like", likeBlog);



module.exports = router;