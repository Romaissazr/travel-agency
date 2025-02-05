import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const normalizeDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ConfirmBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tour, bookingDetails } = location.state || {};
  const [availableSpots, setAvailableSpots] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!user.id) {
      toast.error("Please log in to confirm your booking.");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (tour && bookingDetails?.selectedDate) {
      fetchAvailableSpots();
    }
  }, [tour, bookingDetails?.selectedDate]);

  const fetchAvailableSpots = async () => {
    if (!tour?._id) {
      toast.error("Invalid tour data.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/tour/${tour._id}`);
      if (!response.ok) throw new Error("Failed to fetch available spots.");

      const data = await response.json();
      const bookedSpotsForDate = data.bookings
        .filter(
          (booking) =>
            normalizeDate(new Date(booking.selectedDate)) ===
              normalizeDate(new Date(bookingDetails.selectedDate)) &&
            booking.status !== "cancelled"
        )
        .reduce((sum, booking) => sum + booking.groupSize, 0);

      setAvailableSpots(Math.max(0, tour.maxGroupSize - bookedSpotsForDate));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConfirm = async () => {
    if (isLoading || availableSpots === 0) return;
    setIsLoading(true);

    if (!tour || !bookingDetails) {
      toast.error("Invalid booking details.");
      setIsLoading(false);
      return;
    }

    const normalizedSelectedDate = normalizeDate(
      new Date(bookingDetails.selectedDate)
    );
    const isDateAvailable =
      Array.isArray(tour.availableDates) &&
      tour.availableDates.some((availableDate) => {
        const dateString = availableDate.date || availableDate;
        return normalizeDate(new Date(dateString)) === normalizedSelectedDate;
      });

    if (!isDateAvailable) {
      toast.error(
        "The selected date is not available for booking. Please choose another date."
      );
      setIsLoading(false);
      return;
    }

    if (bookingDetails.groupSize > availableSpots) {
      toast.error(
        `Only ${availableSpots} spots available. Reduce your group size.`
      );
      setIsLoading(false);
      return;
    }

    const payload = {
      userId: user.id,
      tourId: tour._id,
      selectedDate: normalizedSelectedDate,
      groupSize: bookingDetails.groupSize,
      totalPrice: tour.price * bookingDetails.groupSize,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm booking");
      }

      toast.success("Booking confirmed successfully!");
      navigate("/tour/profile/history");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      fetchAvailableSpots();
    }
  };

  if (!tour || !bookingDetails) {
    toast.error("No booking details available. Restart your booking.");
    navigate("/book-tour");
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Confirm Your Booking
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Welcome, {user.firstName || "Guest"} {user.lastName}!
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {tour.title}
          </h2>
          <p className="text-gray-600 mb-6">{tour.description}</p>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Date:</span>
              <span className="text-gray-900">
                {formatDate(bookingDetails.selectedDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Group Size:</span>
              <span className="text-gray-900">{bookingDetails.groupSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">
                Available Spots:
              </span>
              <span className="text-gray-900">{availableSpots}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Total Price:</span>
              <span className="text-gray-900 font-semibold">
                ${tour.price * bookingDetails.groupSize}
              </span>
            </div>
          </div>

          <button
            className="mt-8 w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={isLoading || availableSpots === 0}
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ConfirmBooking;
