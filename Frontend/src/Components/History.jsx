import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function History() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchBookingsAndTours = async () => {
      if (!user || !user.id) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const bookingsResponse = await fetch(
          `${API_BASE_URL}/bookings/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!bookingsResponse.ok) {
          throw new Error(
            (await bookingsResponse.json()).message || "Failed to fetch bookings."
          );
        }

        const bookingsData = await bookingsResponse.json();
        const userBookings = bookingsData.bookings || [];

        const toursResponse = await fetch(`${API_BASE_URL}/tours/`);
        if (!toursResponse.ok) {
          throw new Error("Failed to fetch tours.");
        }

        const toursData = await toursResponse.json();
        const toursMap = toursData.data.reduce((acc, tour) => {
          acc[tour._id] = tour;
          return acc;
        }, {});

        const bookingsWithTours = userBookings.map((booking) => ({
          ...booking,
          tour: toursMap[booking.tour._id] || booking.tour,
        }));

        setBookings(bookingsWithTours);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookingsAndTours();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error((await response.json()).message || "Failed to cancel booking.");
      }

      toast.success("Booking cancelled successfully.");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoToPayment = (bookingId) => {
    navigate("/tour/payment", { state: { bookingId } });
  };

  const handleWriteReview = (tourId) => {
    setSelectedTourId(tourId);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          tourId: selectedTourId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || "Failed to submit review.");
      }

      toast.success("Review submitted successfully.");
      setShowReviewModal(false);
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-rose-500">{error}</p>;

  if (bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 w-full h-full overflow-y-scroll">
      <h1 className="text-2xl md:text-3xl font-bold mb-5">Booking History</h1>
      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => {
          const tour = booking.tour;
          const imageUrl = tour?.images?.[0]
            ? `${API_BASE_URL}/uploads/${tour.images[0].split("\\").pop()}`
            : "https://via.placeholder.com/100";
          const totalPrice = tour?.price * booking.groupSize;

          return (
            <div
              key={booking._id}
              className="p-5 border rounded-md shadow-md bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row items-center mb-4">
                <img
                  src={imageUrl}
                  alt={tour?.title || "Tour Image"}
                  className="w-24 h-24 object-cover rounded-md mb-4 md:mb-0 md:mr-4"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100";
                  }}
                />
                <div>
                  <h2 className="text-lg font-semibold">{tour?.title}</h2>
                  <p className="text-sm text-gray-600">{tour?.city}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {booking.status}
                  </span>
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : booking.paymentStatus === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {new Date(booking.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {booking.selectedDate
                    ? new Date(booking.selectedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : "Date not available"}
                </p>
                <p>
                  <strong>Time:</strong> {tour.time}
                </p>
                <p>
                  <strong>Group Size:</strong> {booking.groupSize}
                </p>
                <p>
                  <strong>Total Price:</strong> ${totalPrice}
                </p>
              </div>

              <div className="mt-4 space-x-4 ">
                {booking.status !== "cancelled" && (
                  <button
                    className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel
                  </button>
                )}
                {booking.paymentStatus === "pending" && booking.status !== "cancelled" && (
                  <button
                    className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
                    onClick={() => handleGoToPayment(booking._id)}
                  >
                    Go to Payment
                  </button>
                )}
                <button
                  className="bg-green-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={() => handleWriteReview(tour._id)}
                >
                  Write Review
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 px-10 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Write a Review</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Rating (0-5):</label>
              <input
                type="number"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Comment:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border rounded-md p-2 w-full"
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600"
                onClick={handleSubmitReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
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

export default History;