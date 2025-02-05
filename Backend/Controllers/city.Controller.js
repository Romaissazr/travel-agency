const mongoose = require('mongoose'); // Add this line
const City = require('../Models/Cities.Model');
const Tour = require('../Models/tour.Model'); // Ensure this is correctly imported

// Method to add a city
const addCity = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: 'All required fields must be provided',
      });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const newCity = new City({
      name,
      description,
      images,
    });

    await newCity.save();

    res.status(201).json({
      message: 'City added successfully!',
      city: newCity,
    });
  } catch (error) {
    console.error('Error adding city:', error);
    res.status(500).json({
      message: 'Error adding city',
      error: error.message,
    });
  }
};

// Method to get all cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json({
      message: 'Cities retrieved successfully',
      cities,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      message: 'Error fetching cities',
      error: error.message,
    });
  }
};

// Method to get a city by its ID
const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({
        message: 'City not found',
      });
    }
    res.status(200).json({
      message: 'City found successfully',
      city,
    });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({
      message: 'Error fetching city',
      error: error.message,
    });
  }
};

// Method to update a city by its ID
const updateCity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;

    if (req.files) {
      updates.images = req.files.map(file => file.path);
    }

    const updatedCity = await City.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedCity) {
      return res.status(404).json({
        message: 'City not found',
      });
    }

    res.status(200).json({
      message: 'City updated successfully',
      city: updatedCity,
    });
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({
      message: 'Error updating city',
      error: error.message,
    });
  }
};

// Method to delete a city by its ID
const deleteCity = async (req, res) => {
  try {
    const cityId = req.params.id;

 
    const city = await City.findByIdAndDelete(cityId);

    if (!city) {
      return res.status(404).json({
        message: 'City not found',
      });
    }

   
    await Tour.deleteMany({ city: cityId });

    res.status(200).json({
      message: 'City and associated tours deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting city and tours:', error);
    res.status(500).json({
      message: 'Error deleting city and tours',
      error: error.message,
    });
  }
};

module.exports = { addCity, getAllCities, getCityById, updateCity, deleteCity };