const express = require('express');
const upload = require('../Middleware/upload');
const { addCity, getAllCities, getCityById, updateCity, deleteCity } = require('../Controllers/city.Controller');
const router = express.Router();

// Route to add a new city
router.post('/', upload.array('images', 1), addCity);

// Route to get all cities
router.get('/', getAllCities);

// Route to get a city by its ID
router.get('/:id', getCityById);

// Route to update a city by its ID
router.put('/:id', upload.array('images', 1), updateCity);

// Route to delete a city by its ID
router.delete('/:id', deleteCity);

module.exports = router;
