const Booking = require('../Models/booking.Model');
const Tour = require('../Models/tour.Model');
const User = require('../Models/user.Model');

// Helper: Check if all slots in a tour are fully booked
const isTourFullyBooked = async (tourId) => {
  const tour = await Tour.findById(tourId);
  if (!tour) throw new Error('Tour not found.');

  const allSlotsExhausted = tour.availableDates.every(
    (dateObj) => dateObj.availableSlots === 0
  );

  return allSlotsExhausted;
};

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { userId, tourId, groupSize, selectedDate } = req.body;

   
    if (!userId || !tourId || !groupSize || !selectedDate) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const user = await User.findById(userId);
    const tour = await Tour.findById(tourId);

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (!tour) return res.status(404).json({ message: 'Tour not found.' });

   
    const normalizedSelectedDate = new Date(selectedDate).toISOString().split('T')[0];


    const selectedDateIndex = tour.availableDates.findIndex(
      (dateObj) => dateObj.date.toISOString().split('T')[0] === normalizedSelectedDate
    );

    if (selectedDateIndex === -1) {
      return res.status(400).json({ message: 'The selected date is not available for booking.' });
    }

    const availableSpots = tour.availableDates[selectedDateIndex].availableSlots;

    if (groupSize > availableSpots) {
      return res.status(400).json({
        message: `Only ${availableSpots} spots are available. Please reduce your group size.`,
      });
    }

   
    const totalPrice = groupSize * tour.price;

  
    const newBooking = new Booking({
      user: userId,
      tour: tourId,
      groupSize,
      selectedDate: normalizedSelectedDate,
      totalPrice,
    });

    await newBooking.save();

 
    tour.availableDates[selectedDateIndex].availableSlots -= groupSize;
    await tour.save();

  
    if (await isTourFullyBooked(tourId)) {
      tour.status = 'fully booked';
      await tour.save();
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Error creating booking.', error: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('tour', 'title city dateFrom dateTo');
    res.status(200).json({ message: 'Bookings retrieved successfully.', bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings.', error: error.message });
  }
};

// Get bookings for a specific user
const getUserBookings = async (req, res) => {
  const userId = req.params.userId;
  try {
    const bookings = await Booking.find({ user: userId }).populate('tour', 'title city dateFrom dateTo');
    res.status(200).json({ message: 'User bookings retrieved successfully.', bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error.message);
    res.status(500).json({ message: 'Error fetching user bookings.', error: error.message });
  }
};

// Get bookings for a specific tour
const getTourBookings = async (req, res) => {
  try {
    const { tourId } = req.params;
    const bookings = await Booking.find({ tour: tourId });
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching tour bookings:', error.message);
    res.status(500).json({ message: 'Error fetching tour bookings.', error: error.message });
  }
};


// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

   
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });


    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    const tour = await Tour.findById(booking.tour);
    if (!tour) return res.status(404).json({ message: 'Tour not found.' });

    const normalizedSelectedDate = booking.selectedDate.toISOString().split('T')[0];

    const selectedDateIndex = tour.availableDates.findIndex(
      (dateObj) => dateObj.date.toISOString().split('T')[0] === normalizedSelectedDate
    );

  
    if (selectedDateIndex !== -1) {
      tour.availableDates[selectedDateIndex].availableSlots += booking.groupSize;
    }

  
    booking.status = 'cancelled';
    await booking.save();

  
    await tour.save();

   
    const isFullyBooked = await isTourFullyBooked(tour._id);
    if (!isFullyBooked) {
      tour.status = 'active'; 
      await tour.save();
    }

    res.status(200).json({
      message: 'Booking cancelled successfully.',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error.message);
    res.status(500).json({ message: 'Error cancelling booking.', error: error.message });
  }
};
// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus } = req.body;

    if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status.' });
    }


    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus },
      { new: true } 
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.status(200).json({ message: 'Payment status updated successfully.', booking });
  } catch (error) {
    console.error('Error updating payment status:', error.message);
    res.status(500).json({ message: 'Error updating payment status.', error: error.message });
  }
};

// Update Booking
const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { selectedDate, groupSize } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    const tour = await Tour.findById(booking.tour);
    if (!tour) return res.status(404).json({ message: 'Tour not found.' });

    // Adjust availableSlots for the original date
    const originalDateIndex = tour.availableDates.findIndex(
      (dateObj) => dateObj.date.toISOString().split('T')[0] === booking.selectedDate.toISOString().split('T')[0]
    );

    if (originalDateIndex !== -1) {
      tour.availableDates[originalDateIndex].availableSlots += booking.groupSize;
    }

   
    if (selectedDate) {
      const normalizedSelectedDate = new Date(selectedDate).toISOString().split('T')[0];

      const newDateIndex = tour.availableDates.findIndex(
        (dateObj) => dateObj.date.toISOString().split('T')[0] === normalizedSelectedDate
      );

      if (newDateIndex === -1) {
        return res.status(400).json({ message: 'Selected date is not available for booking.' });
      }

      if (groupSize > tour.availableDates[newDateIndex].availableSlots) {
        return res.status(400).json({
          message: `Only ${tour.availableDates[newDateIndex].availableSlots} spots are available.`,
        });
      }

      booking.selectedDate = normalizedSelectedDate;
      tour.availableDates[newDateIndex].availableSlots -= groupSize;
    }

    if (groupSize) {
      booking.groupSize = groupSize;
      booking.totalPrice = groupSize * tour.price;
    }

    await booking.save();
    await tour.save();

  
    if (await isTourFullyBooked(booking.tour)) {
      tour.status = 'fully booked';
    } else {
      tour.status = 'active'; 
    }
    await tour.save();

    res.status(200).json({ message: 'Booking updated successfully.', booking });
  } catch (error) {
    console.error('Error updating booking:', error.message);
    res.status(500).json({ message: 'Error updating booking.', error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  getTourBookings,
  updatePaymentStatus,
  updateBooking,
};