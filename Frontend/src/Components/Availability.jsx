import { useState } from "react";

function Availability({ onFilterChange }) {
  const [duration, setDuration] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");

  const handleFilterChange = (filterType, value) => {
    let updatedFilters = { duration, guests, date };

    if (filterType === "duration") updatedFilters.duration = value;
    if (filterType === "guests") updatedFilters.guests = value;
    if (filterType === "date") {
      updatedFilters.date = value
        ? new Date(value).toISOString().split("T")[0]
        : "";
    }

    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Filter by Availability</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Duration
        </label>
        <select
          value={duration}
          onChange={(e) => {
            setDuration(e.target.value);
            handleFilterChange("duration", e.target.value);
          }}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="1">1 hour</option>
          <option value="2">2 hours</option>
          <option value="3">3+ hours</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Guests
        </label>
        <input
          type="number"
          value={guests}
          onChange={(e) => {
            setGuests(e.target.value);
            handleFilterChange("guests", e.target.value);
          }}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="Number of Guests"
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            handleFilterChange("date", e.target.value);
          }}
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>
    </div>
  );
}

export default Availability;
