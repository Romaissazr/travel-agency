import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";


const normalizeDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
function BookingForm({ data, onConfirmBooking }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedGroupSize, setSelectedGroupSize] = useState(1);
  const navigate = useNavigate();

 
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };


  const handleConfirmBooking = () => {
    if (!selectedDate) {
      toast.error("Please select a date for booking.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

   

    const bookingDetails = {
      selectedDate: normalizeDate(selectedDate),
      groupSize: selectedGroupSize,
    };
    if (!isLoggedIn()) {
      toast.error("You must be logged in to confirm the booking. Redirecting to login...", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => navigate("/auth/", { state: { from: "/tour/confirm", tour: data, bookingDetails: { selectedDate, groupSize: selectedGroupSize } } }),
      });
      return;
    }
    onConfirmBooking(bookingDetails);
    navigate("/tour/confirm", { state: { tour: data, bookingDetails } });
  };

  
  const filterAvailableDates = (date) => {
    // Normalize the selected date to compare it with the available dates
    const normalizedSelectedDate = normalizeDate(date);

    return data.availableDates.some(({ date }) => {
      const normalizedAvailableDate = normalizeDate(new Date(date));
      return normalizedAvailableDate === normalizedSelectedDate;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start mt-10 lg:mt-28 px-4 sm:px-8 lg:px-16">
      {/* Booking Form */}
      <div className="w-full lg:w-[400px] p-6 bg-white drop-shadow-lg rounded-lg">
        <h1 className="font-bold text-xl border-b pb-4">Booking</h1>
        <div className="mt-6">
          <p className="font-semibold text-lg">Select a Date</p>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            filterDate={filterAvailableDates}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            minDate={new Date()}
            className="w-[125%] lg:w-full my-3 text-dark py-2 border-0 outline-0 bg-gray-100 pl-5 rounded-lg"
          />
        </div>
        <div className="mt-6">
          <p className="font-semibold text-lg">No. of Guests</p>
          <select
            className="w-full my-3 text-dark py-2 border-0 outline-0 bg-gray-100 pl-5 rounded-lg"
            value={selectedGroupSize}
            onChange={(e) => setSelectedGroupSize(Number(e.target.value))}
            aria-label="Number of guests"
          >
            {Array.from({ length: data.maxGroupSize }, (_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition mt-6"
          onClick={handleConfirmBooking}
        >
          Confirm Booking
        </button>
      </div>

      {/* Toast Container */}
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

BookingForm.propTypes = {
  data: PropTypes.shape({
    availableDates: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        availableSlots: PropTypes.number.isRequired,
      })
    ).isRequired,
    maxGroupSize: PropTypes.number.isRequired,
  }).isRequired,
  onConfirmBooking: PropTypes.func.isRequired,
};

export default BookingForm;