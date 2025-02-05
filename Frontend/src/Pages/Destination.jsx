import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Components/Card";
import { useNavigate } from "react-router";

function Destination() {
  const [destinations, setDestinations] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const sortOptions = {
    priceLowToHigh: "price_asc",
    priceHighToLow: "price_desc",
    ratingHighToLow: "rating_desc",
    durationShortToLong: "duration_asc",
  };


  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/city/`);
        setCities(response.data.cities || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to load cities.");
        setCities([]);
      }
    };
    fetchCities();
  }, []);


  useEffect(() => {
    const fetchPaginatedTours = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/tours/page?page=${page}&limit=15`;

        if (selectedCity) {
          url = `${API_BASE_URL}/tours/city/${selectedCity}?page=${page}&limit=15`;
        }

        if (sortBy) {
          const mappedSort = sortOptions[sortBy];
          if (mappedSort) {
            url += `&sort=${mappedSort}`;
          }
        }


        const response = await axios.get(url);


        let toursData = [];
        if (Array.isArray(response.data)) {
          toursData = response.data;
        } else if (response.data?.data) {
          toursData = response.data.data;
        } else {
          toursData = [];
        }

        setDestinations(toursData);
        setTotalPages(response.data?.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error("Error fetching paginated tours:", err);
        setDestinations([]);
        setError("Failed to load tours.");
      }
      setLoading(false);
    };
    fetchPaginatedTours();
  }, [page, selectedCity, sortBy]);


  useEffect(() => {
  }, [selectedCity, sortBy, destinations]);


  const getCityNameById = (cityId) => {
    const city = cities.find((city) => city._id === cityId);
    return city ? city.name : "Unknown City";
  };

  const handleCardClick = (tour) => {
    navigate(`/tour`, { state: { tour } });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        Explore Destinations
      </h2>


      {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}


      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">

        <div className="w-full sm:w-1/2 lg:w-1/4">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Filter by City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setPage(1);
            }}
            className="mt-1 p-2 border rounded-md w-full text-sm sm:text-base"
          >
            <option value="">All Cities</option>
            {cities?.length > 0 &&
              cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
          </select>
        </div>


        <div className="w-full sm:w-1/2 lg:w-1/4">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="mt-1 p-2 border rounded-md w-full text-sm sm:text-base"
          >
            <option value="">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="ratingHighToLow">Rating: High to Low</option>
            <option value="durationShortToLong">Duration: Short to Long</option>
          </select>
        </div>
      </div>


      {loading ? (
        <p className="text-blue-500 text-sm sm:text-base">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {destinations?.length > 0 ? (
            destinations.map((tour) => (
              <Card
                key={tour._id}
                img={tour.images?.[0] || "default-tour-image.jpg"}
                cityName={getCityNameById(tour.city)}
                description={tour.title}
                duration={`${tour.duration} hours`}
                price={tour.price}
                reviews={tour.reviews?.length || 0}
                rating={tour.rating || 0}
                onClick={() => handleCardClick(tour)}
              />
            ))
          ) : (
            <p className="text-gray-600 text-sm sm:text-base col-span-full">
              No destinations available.
            </p>
          )}
        </div>
      )}


      {!selectedCity && (
        <div className="flex justify-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="p-2 mx-2 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Previous
          </button>
          <span className="p-2 text-sm sm:text-base">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="p-2 mx-2 bg-white border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Destination;
