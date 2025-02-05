import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Header from '../Components/Header';
import City from '../Components/City';
import CityInfo from '../Components/CityInfo';
import Card from '../Components/Card';
import CityFeature from '../Components/CityFeature';
import CustomSlider from '../Components/CustomSlider';
import MobileApp from '../Components/MobileApp';
import Gallery from '../Components/Gallery';
import Footer from '../Components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;


function Home() {
  const [tours, setTours] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedCityInfo, setSelectedCityInfo] = useState({});
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursResponse, citiesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/tours/`),
          axios.get(`${API_BASE_URL}/city/`),
        ]);

        const toursData = toursResponse.data.data;
        const citiesData = citiesResponse.data.cities;

        setTours(toursData);
        setCities(citiesData);

        if (citiesData.length > 0) {
          const defaultCityId = citiesData[0]._id;
          setSelectedCityId(defaultCityId);
          fetchCityInfo(defaultCityId);
          filterToursByCity(defaultCityId, toursData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchCityInfo = async (cityId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/city/${cityId}`);
      setSelectedCityInfo(response.data.city);
    } catch (error) {
      console.error("Error fetching city details:", error);
      setError("Failed to fetch city details.");
    }
  };

  const filterToursByCity = (cityId, toursData) => {
    const filtered = toursData.filter((tour) => tour.city === cityId);
    setFilteredTours(filtered);
  };

  const handleCityClick = (cityId) => {
    setSelectedCityId(cityId);
    fetchCityInfo(cityId);
    filterToursByCity(cityId, tours);
  };

  const handleCardClick = (tour) => {
    navigate(`/tour`, { state: { tour } });
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

    return (
      <div>
        <Header />
        
        <div className="text-center py-10 px-4 sm:px-8 md:px-16 lg:px-24">
          <h1 className="text-2xl md:text-3xl font-bold">Explore Popular Cities</h1>
          <p className="max-w-full md:max-w-2xl mx-auto text-dark mt-5">
            Discover vibrant cities filled with rich history, culture, and endless excitement. From bustling streets to iconic landmarks, every corner offers a new adventure.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10">
            {cities.length > 0 ? (
              cities.map((city) => (
                <City
                  key={city._id}
                  city={city.name}
                  onClick={() => handleCityClick(city._id)}
                  className={`cursor-pointer p-2 ${selectedCityId === city._id ? "bg-primary text-white" : ""}`}
                />
              ))
            ) : (
              <p>No cities available.</p>
            )}
          </div>

          <div
            className="flex flex-col justify-center items-center w-full my-20 cursor-pointer"
            onClick={() => {
              if (selectedCityInfo.name) {
                navigate('/tour/city-list', { state: { city: selectedCityInfo } });
              } else {
                console.error("City information is not available.");
              }
            }}
          >
            {selectedCityInfo.name ? (
              <CityInfo
                img={selectedCityInfo.images?.[0] || "default-city-image.jpg"}
                name={selectedCityInfo.name}
                desc={selectedCityInfo.description || "No description available for this city."}
              />
            ) : (
              <p>No city information available.</p>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Explore Popular Cities</h1>
          <p className="max-w-full md:max-w-2xl mx-auto text-dark mt-5">
            Discover vibrant cities filled with rich history, culture, and endless excitement. From bustling streets to iconic landmarks, every corner offers a new adventure.
          </p>


        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-36">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <Card
                  key={tour._id}
                  img={tour.images?.[0] || "default-tour-image.jpg"}
                  cityName={selectedCityInfo.name || "Unknown City"}
                  description={tour.title}
                  duration={`${tour.duration} hours`}
                  price={tour.price}
                  reviews={tour.reviews?.length || 0}
                  rating={tour.rating || 0}
                  onClick={() => handleCardClick(tour)}
                />
              ))
            ) : (
              <p>No tours available for this city.</p>
            )}
          </div>
          
        <CityFeature />
        <CustomSlider />
        <MobileApp />
        <Gallery />
        <Footer />
      </div>
    )
  }

  export default Home
