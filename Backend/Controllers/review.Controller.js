// controllers/review.Controller.js
const Review = require("../Models/review.Model");
const Tour = require("../Models/tour.Model");

// Add or update a review
const addReview = async (req, res) => {
  try {
    const { userId, tourId, rating, comment } = req.body;

    if (!userId || !tourId || rating === undefined) {
      return res.status(400).json({ message: "User ID, Tour ID, and rating are required." });
    }

 
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

 
    const existingReview = await Review.findOne({ user: userId, tour: tourId });

    if (existingReview) {
   
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
 
      const newReview = new Review({ user: userId, tour: tourId, rating, comment });
      await newReview.save();

     
      await Tour.findByIdAndUpdate(
        tourId,
        { $push: { reviews: newReview._id } }, 
        { new: true }
      );
    }

   
    const reviews = await Review.find({ tour: tourId });
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatings / reviews.length;


    await Tour.findByIdAndUpdate(tourId, { rating: averageRating });

    res.status(200).json({ message: "Review added/updated successfully." });
  } catch (error) {
    console.error("Error adding/updating review:", error.message);
    res.status(500).json({ message: "Error adding/updating review.", error: error.message });
  }
};

const getTourReviews = async (req, res) => {
  const tourId = req.params.tourId;
  try {
    const reviews = await Review.find({ tour: tourId }).populate(
      "user",
      "firstName lastName email"
    );
    res.status(200).json({ message: "Reviews retrieved successfully.", reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ message: "Error fetching reviews.", error: error.message });
  }
};


module.exports = { addReview ,getTourReviews };