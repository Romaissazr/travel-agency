import { useState } from "react";
import { HiUsers } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";
import Button from "./Button";
import { toast, ToastContainer } from "react-toastify";

function SearchBar({ cities }) {
  const navigate = useNavigate();

  // State for search inputs
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState(null);

  const handleSearch = () => {
    if (!location && !date && guests === 1) {
      toast.warn(
        "Please select at least one filter (location, date, or guests)."
      );
      return;
    }

    navigate("/search-results", { state: { location, guests, date } });
  };

  return (
    <div className="flex justify-center items-center mt-[10px] md:mt-[100px] px-4">
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between max-w-[1000px] bg-white px-4 md:px-8 py-5 rounded-[15px] shadow-lg">
        <div className="flex w-[90%] mb-3 sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2 items-center text-primary font-semibold mb-1">
              <IoLocationSharp className="text-xl" />
              <p className="text-[14px]">Location</p>
            </div>
            <select
              className="w-full pl-2 pr-4 py-1 text-[14px] cursor-pointer bg-transparent rounded-lg outline-none transition-all"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <div className="flex gap-2 items-center text-primary font-semibold mb-1">
              <HiUsers className="text-xl" />
              <p className="text-[14px]">Guests</p>
            </div>
            <input
              type="number"
              className="w-full pl-2 pr-4 py-1 text-[14px] rounded-lg outline-none transition-all"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              min="1"
            />
          </div>

          <div className="flex-1 z-30">
            <div className="flex gap-2 items-center text-primary font-semibold mb-1">
              <SlCalender className="text-xl" />
              <p className="text-[14px]">Date</p>
            </div>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              className="w-full pl-2 pr-4 py-1 text-[14px] rounded-lg outline-none transition-all"
              placeholderText="Pick a date"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              popperClassName="centered-datepicker"
              popperPlacement="bottom"
            />
          </div>
        </div>

        <Button text={"Search"} onClick={handleSearch} />
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

export default SearchBar;
