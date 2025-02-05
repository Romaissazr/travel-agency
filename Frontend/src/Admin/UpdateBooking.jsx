import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UpdateBooking() {
  const location = useLocation();
  const { booking: initialBooking } = location.state || {};
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: initialBooking?.selectedDate
      ? new Date(initialBooking.selectedDate)
      : null,
    groupSize: initialBooking?.groupSize || 1,
    paymentStatus: initialBooking?.paymentStatus || "pending",
    status: initialBooking?.status || "confirmed",
  });

  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const tourId = initialBooking?.tour?._id || id;
        const response = await axios.get(
          `${API_BASE_URL}/tours/${tourId}/available-dates`
        );

        if (response.data.success) {
          setAvailableDates(
            response.data.availableDates.map(
              (dateObj) => new Date(dateObj.date)
            )
          );
        } else {
          throw new Error("Failed to fetch available dates");
        }
      } catch (error) {
        console.error("Error fetching available dates:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch available dates."
        );
      }
    };

    if (initialBooking?.tour?._id || id) {
      fetchAvailableDates();
    }
  }, [initialBooking, id]);

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingPayload = {
        date: formData.date.toISOString(),
        groupSize: formData.groupSize,
        status: formData.status,
      };

      const bookingResponse = await axios.patch(
        `${API_BASE_URL}/bookings/${initialBooking?._id || id}`,
        bookingPayload
      );

      if (bookingResponse.status === 200) {
        toast.success("Booking updated successfully!");
      }

      const paymentPayload = {
        paymentStatus: formData.paymentStatus,
      };

      const paymentResponse = await axios.patch(
        `${API_BASE_URL}/${initialBooking?._id || id}/payment-status`,
        paymentPayload
      );

      if (paymentResponse.status === 200) {
        toast.success("Payment status updated successfully!");
      }

      setTimeout(() => navigate("/admin/bookings"), 2000);
    } catch (error) {
      console.error("Error updating booking or payment status:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update booking. Please try again."
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Update Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Booking ID
          </label>
          <input
            type="text"
            value={initialBooking?._id || id}
            readOnly
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Date
          </label>
          <DatePicker
            selected={formData.date}
            onChange={(date) => handleChange("date", date)}
            filterDate={(date) =>
              availableDates.some(
                (availableDate) =>
                  date.getFullYear() === availableDate.getFullYear() &&
                  date.getMonth() === availableDate.getMonth() &&
                  date.getDate() === availableDate.getDate()
              )
            }
            dateFormat="yyyy-MM-dd"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholderText="Select an available date"
          />
          {formData.date && (
            <p className="text-sm text-gray-600 mt-1">
              Selected Date: {formData.date.toLocaleDateString("en-US")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Group Size
          </label>
          <input
            type="number"
            name="groupSize"
            value={formData.groupSize}
            onChange={(e) =>
              handleChange("groupSize", parseInt(e.target.value, 10))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={(e) => handleChange("paymentStatus", e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Booking Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded-md "
        >
          Update Booking and Payment Status
        </button>
      </form>
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

export default UpdateBooking;
