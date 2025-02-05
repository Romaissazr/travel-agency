const Tour = require('../Models/tour.Model');
const Booking = require('../Models/booking.Model'); // Ensure this import exists
const mongoose = require('mongoose');

// Controller function for adding a tour
const addTour = async (req, res) => {
  try {
    const {
      title,
      city,
      address,
      distance,
      duration,
      description,
      price,
      maxGroupSize,
      availableDates,
      time,
      activity,
      included,
      notIncluded,
      safety,
      language,
      meetingPoint,
    } = req.body;

    // Parse fields sent as JSON strings
    const parsedAvailableDates = availableDates ? JSON.parse(availableDates) : [];
    const parsedActivity = activity ? JSON.parse(activity) : [];
    const parsedIncluded = included ? JSON.parse(included) : [];
    const parsedNotIncluded = notIncluded ? JSON.parse(notIncluded) : [];
    const parsedLanguage = language ? JSON.parse(language) : ["English"];
    const parsedMeetingPoint = meetingPoint ? JSON.parse(meetingPoint) : {};

    // Validate and format availableDates
    const validAvailableDates = parsedAvailableDates.map((dateObj) => {
      const date = new Date(dateObj.date);
      if (isNaN(date)) {
        throw new Error(`Invalid date: ${dateObj.date}`);
      }
      const slots = dateObj.availableSlots || maxGroupSize;
      if (!slots || isNaN(slots)) {
        throw new Error(`Invalid availableSlots for date: ${dateObj.date}`);
      }
      return {
        date,
        availableSlots: parseInt(slots, 10),
      };
    });

    // Handle uploaded images
    const images = req.files ? req.files.map((file) => file.filename) : [];

    // Create new tour
    const newTour = new Tour({
      title,
      city,
      address,
      distance,
      duration,
      description,
      price,
      maxGroupSize,
      availableSlots: maxGroupSize || 0, // Initial available slots
      availableDates: validAvailableDates,
      time,
      activity: parsedActivity,
      included: parsedIncluded,
      notIncluded: parsedNotIncluded,
      safety,
      language: parsedLanguage,
      meetingPoint: parsedMeetingPoint,
      images,
      status: "active",
    });

    // Save the tour
    await newTour.save();

    res.status(201).json({ message: "Tour added successfully!", tour: newTour });
  } catch (error) {
    console.error("Error adding tour:", error);
    res.status(500).json({ message: "Error adding tour", error: error.message });
  }
};



// Controller function for updating a tour
const updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch current tour data for reference
    const currentTour = await Tour.findById(id);
    if (!currentTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Parse and validate incoming data
    const updatedData = { ...req.body };

    // Handle existing images
    if (updatedData.existingImages) {
      updatedData.images = JSON.parse(updatedData.existingImages);
    } else {
      updatedData.images = [];
    }

    // Add new images if provided
    if (req.files) {
      const newImages = req.files.map((file) => file.filename);
      updatedData.images = [...updatedData.images, ...newImages];
    }

    // Parse JSON fields if necessary
    if (updatedData.activity) {
      updatedData.activity = JSON.parse(updatedData.activity);
    }
    if (updatedData.included) {
      updatedData.included = JSON.parse(updatedData.included);
    }
    if (updatedData.notIncluded) {
      updatedData.notIncluded = JSON.parse(updatedData.notIncluded);
    }
    if (updatedData.language) {
      updatedData.language = JSON.parse(updatedData.language);
    }
    if (updatedData.meetingPoint) {
      updatedData.meetingPoint = JSON.parse(updatedData.meetingPoint);
    }
    if (updatedData.reviews) {
      updatedData.reviews = JSON.parse(updatedData.reviews);
    }

    // Handle availableDates update
    if (updatedData.availableDates) {
      const parsedAvailableDates = JSON.parse(updatedData.availableDates);
      updatedData.availableDates = parsedAvailableDates.map((dateObj) => {
        const date = new Date(dateObj.date);
        if (isNaN(date)) {
          throw new Error(`Invalid date: ${dateObj.date}`);
        }
        return {
          date: date.toISOString(),
          availableSlots: dateObj.availableSlots || currentTour.maxGroupSize,
        };
      });
    }

    // Set defaults for optional fields if missing
    if (!updatedData.maxGroupSize) {
      updatedData.maxGroupSize = currentTour.maxGroupSize;
    }
    if (!updatedData.availableSlots) {
      updatedData.availableSlots = currentTour.maxGroupSize;
    }

    // Update the tour in the database
    const updatedTour = await Tour.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({
      message: "Failed to update tour",
      error: error.message,
    });
  }
};

module.exports = {
  updateTour,
};




// Controller function for deleting a tour
const deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
  
    await Tour.findByIdAndDelete(id);

 
    await Booking.deleteMany({ tour: id });

    res.status(200).json({
      success: true,
      message: 'Tour and associated bookings deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tour:', error); 
    res.status(500).json({ message: 'Failed to delete tour', error: error.message });
  }
};

// Controller function for getting all tours
const getAllTours = async (req, res) => {
  try {
   
    const tours = await Tour.find();

    res.status(200).json({
      success: true,
      message: 'Tours retrieved successfully',
      data: tours,
    });
  } catch (error) {
    res.status(404).json({ message: 'Tours not found', error: error.message });
  }
};

// Controller function for getting a single tour by ID
const getTourById = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id).populate('city', '_id name'); 
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tour', error: error.message });
  }
};

// Get tours by city ID
const getToursByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;

   
    const tours = await Tour.find({ city: cityId });

   
    if (!tours || tours.length === 0) {
      return res.status(404).json({ message: 'No tours found for this city.' });
    }

    
    res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching tours by city ID:', error);
    res.status(500).json({ message: 'Failed to fetch tours by city ID.' });
  }
};
const getAvailableDates = async (req, res) => {
  try {
    const { tourId } = req.params;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: "Tour not found." });
    }

    res.status(200).json({
      success: true,
      availableDates: tour.availableDates.map((dateObj) => ({
        date: dateObj.date.toISOString().split("T")[0],
        availableSlots: dateObj.availableSlots,
      })),
    });
  } catch (error) {
    console.error("Error fetching available dates:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching available dates.",
      error: error.message,
    });
  }
};
const getToursByPage = async (req, res) => {
  try {
    const { page = 1, limit = 6, sort } = req.query; 

    
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: "Invalid page or limit parameters" });
    }

   
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case "price_asc":
          sortOptions = { price: 1 }; 
          break;
        case "price_desc":
          sortOptions = { price: -1 }; 
          break;
        case "rating_desc":
          sortOptions = { rating: -1 }; 
          break;
        case "duration_asc":
          sortOptions = { duration: 1 }; 
          break;
        default:
          sortOptions = {}; 
      }
    }

   
    const tours = await Tour.find()
      .sort(sortOptions)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .exec();

   
    const totalTours = await Tour.countDocuments();

    res.status(200).json({
      success: true,
      message: "Tours retrieved successfully",
      totalTours,
      totalPages: Math.ceil(totalTours / limitNumber),
      currentPage: pageNumber,
      data: tours,
    });
  } catch (error) {
    console.error("Error fetching paginated tours:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



module.exports = {
  addTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTourById,
  getToursByCityId,
  getAvailableDates,
  getToursByPage
};