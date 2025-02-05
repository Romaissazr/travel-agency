const express = require("express");
const router = express.Router();
const { addReview, getTourReviews } = require("../Controllers/review.Controller");

// Add or update a review
router.post("/", addReview);
router.get("/:tourId", getTourReviews);

module.exports = router;