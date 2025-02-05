import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../Components/Card";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function SearchResults() {
  const location = useLocation();
  const { location: cityId, guests, date } = location.state || {};

  const [filteredTours, setFilteredTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFilteredTours = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tours/`);
        let tours = response.data.data;

        if (cityId) {
          tours = tours.filter((tour) => tour.city === cityId);
        }

        if (date) {
          tours = tours.filter((tour) =>
            tour.availableDates.some(
              (availableDate) =>
                new Date(availableDate.date).toDateString() ===
                new Date(date).toDateString()
            )
          );
        }

        if (guests) {
          tours = tours.filter((tour) => tour.availableSlots >= guests);
        }

        setFilteredTours(tours);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setError("Failed to fetch tours. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredTours();
  }, [cityId, guests, date]);

  const handleCardClick = (tour) => {
    navigate(`/tour`, { state: { tour } });
  };

  return (
    <div>
      <Header />
      <div className="text-center py-10 sm:py-20 px-4 sm:px-8 lg:px-20">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Search Results
        </h1>
        <p className="text-dark mt-3 sm:mt-5">
          Showing results for your selection.
        </p>

        {isLoading ? (
          <p className="mt-6">Loading tours...</p>
        ) : error ? (
          <p className="text-red-500 mt-6">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 sm:mt-10">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <Card
                  key={tour._id}
                  img={tour.images?.[0] || "default-tour-image.jpg"}
                  cityName={tour.city || "Unknown City"}
                  description={tour.title}
                  duration={`${tour.duration} hours`}
                  price={tour.price}
                  reviews={tour.reviews?.length || 0}
                  rating={tour.rating || 0}
                  onClick={() => handleCardClick(tour)}
                />
              ))
            ) : (
              <p className="col-span-full text-gray-600">
                No tours available for your selection.
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default SearchResults;
