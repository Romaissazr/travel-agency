const express = require('express');
const upload = require('../Middleware/upload'); 
const { 
  addTour, 
  updateTour, 
  deleteTour, 
  getAllTours, 
  getTourById, 
  getToursByCityId,  
  getAvailableDates,
  getToursByPage
} = require('../Controllers/tour.Controller');  

const router = express.Router();
// get all tours by pages
router.get("/page", getToursByPage);
// Handle POST requests for adding a tour, including image uploads
router.post('/', upload.array('images', 10), addTour);

// Update tour
router.put('/:id', upload.array('images', 10), updateTour);

// Delete tour
router.delete('/:id', deleteTour);

// Get all tours
router.get('/', getAllTours);

// Get one tour by ID
router.get('/:id', getTourById);

// Get tours by city ID
router.get('/city/:cityId', getToursByCityId);  

// Route to fetch available dates for a specific tour
router.get("/:tourId/available-dates", getAvailableDates);


module.exports = router;