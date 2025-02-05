import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CityListHeader from "../Components/CityListHeader";
import Availability from "../Components/Availability";
import axios from "axios";
import CustomSlider from "../Components/CustomSlider";
import Gallery from "../Components/Gallery";
import CityCardList from "../Components/CityCardList";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function CityListing() {
  const location = useLocation();
  const city = location.state?.city;
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTours = async () => {
      if (!city || !city._id) {
        console.error("City information is missing or invalid.");
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/tours/city/${city._id}`
        );
        setTours(response.data);
        setFilteredTours(response.data);
      } catch (error) {
        console.error("Error fetching tours:", error.message);
      }
    };

    fetchTours();
  }, [city]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sortedTours = [...filteredTours].sort((a, b) => {
      if (newSortBy === "priceLowToHigh") return a.price - b.price;
      if (newSortBy === "priceHighToLow") return b.price - a.price;
      if (newSortBy === "rating") return b.rating - a.rating;
      return 0;
    });
    setFilteredTours(sortedTours);
  };

  const handleFilterChange = (filters) => {
    const { duration, guests, date } = filters;

    const filtered = tours.filter((tour) => {
      const matchesDuration =
        !duration ||
        (duration === "1" && tour.duration <= 1) ||
        (duration === "2" && tour.duration > 1 && tour.duration <= 2) ||
        (duration === "3" && tour.duration > 2);

      const matchesGuests =
        !guests || tour.maxGroupSize >= parseInt(guests, 10);

      const matchesDate =
        !date ||
        (tour.availableDates &&
          tour.availableDates.some((d) => d.date.split("T")[0] === date));

      return matchesDuration && matchesGuests && matchesDate;
    });

    setFilteredTours(filtered);
  };

  const handleCardClick = (tour) => {
    navigate(`/tour`, { state: { tour } });
  };

  return (
    <div>
      {city ? (
        <CityListHeader
          city={city.name || "Unknown City"}
          count={filteredTours.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      ) : (
        <p className="text-center text-red-500">
          City information not available.
        </p>
      )}

      <div className="bg-[#F9FAFD] px-4 md:px-20 py-10 flex flex-col lg:flex-row gap-10 lg:gap-20">
        <div className="w-full lg:w-[25%]">
          <Availability onFilterChange={handleFilterChange} />
        </div>

        <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => (
              <CityCardList
                key={tour._id}
                rating={tour.rating || 0}
                reviews={tour.reviews?.length || 0}
                imageSrc={tour.images?.[0]}
                title={tour.title}
                price={tour.price}
                duration={`${tour.duration} hours`}
                onClick={() => handleCardClick(tour)}
              />
            ))
          ) : (
            <p className="text-gray-600 col-span-full">
              No tours available for this city.
            </p>
          )}
        </div>
      </div>

      <CustomSlider />
      <Gallery />
    </div>
  );
}

export default CityListing;
