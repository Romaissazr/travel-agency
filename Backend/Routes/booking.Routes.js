const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  getTourBookings,
  updatePaymentStatus,
  updateBooking,
  getAvailableDates, 
} = require("../Controllers/booking.Controller");

// Create a booking
router.post("/", createBooking);

// Get all bookings (Admin)
router.get("/", getAllBookings);

// Get bookings for a specific user
router.get("/user/:userId", getUserBookings);

// Get bookings for a specific tour
router.get("/tour/:tourId", getTourBookings);

// Cancel a booking (update status to "cancelled")
router.patch("/:bookingId/cancel", cancelBooking);

// Update payment status
router.patch("/:bookingId/payment-status", updatePaymentStatus);

// Update a booking
router.patch("/:bookingId", updateBooking); // Add this



module.exports = router;
