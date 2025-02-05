import { useEffect, useState } from "react";
import img from "../assets/Images/city.png";
import img1 from "../assets/Images/shape.svg";
import { IoLocationSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CityFeature() {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTour = async () => {
    try {
      // Fetch all bookings
      const bookingsRes = await axios.get(`${API_BASE_URL}/bookings/`);
      const bookings = bookingsRes.data?.bookings || [];

      let selectedTourId = null;

      if (bookings.length > 0) {
        // Count tour bookings
        const tourBookingCount = {};
        bookings.forEach((booking) => {
          const tourId =
            typeof booking.tour === "object" ? booking.tour?._id : booking.tour;
          if (tourId) {
            tourBookingCount[tourId] = (tourBookingCount[tourId] || 0) + 1;
          }
        });

        // Get most booked tour ID
        selectedTourId = Object.keys(tourBookingCount).reduce((a, b) =>
          tourBookingCount[a] > tourBookingCount[b] ? a : b
        );
      }


      if (!selectedTourId) {
        // If no bookings, fetch the first available tour
        const toursRes = await axios.get(`${API_BASE_URL}/tours/`);
        const tours = toursRes.data.data ;
      
        if (tours.length > 0) {
          selectedTourId = tours[0]._id;
         
          
        }
      }

      if (selectedTourId) {
        const tourRes = await axios.get(`${API_BASE_URL}/tours/${selectedTourId}`);
        setTour(tourRes.data.data);
        
      } else {
        setError("No tours available.");
      }
    } catch (error) {
      console.error("Error fetching tour:", error);
      setError("Failed to fetch tour data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTour();
  }, []);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= (tour?.rating || 0) ? "text-yellow" : "text-[#CFD9DE]"}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[590px] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] md:h-[590px] flex items-center justify-center">
        <p className="text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] my-10 md:h-[590px] flex items-center relative justify-center gap-6 md:gap-36">
      <div className="absolute inset-0 bg-gradient backdrop-blur-[7.5px]"></div>
      <img
        src={img}
        alt="City Background"
        className="object-cover h-full w-full absolute -z-10"
      />

      <div className="overflow-hidden hidden md:flex items-center justify-center md:rounded-custom-ellipse z-20">
        <img
          src={img1}
          alt=""
          className="md:z-10 md:h-full md:w-full md:absolute w-0 h-0"
        />
        {tour.images && tour.images.length > 0 ? (
          <img
            src={`${API_BASE_URL}/uploads/${tour.images[0].split("\\").pop()}`}
            alt="Tour Image"
            className="w-[350px] h-[350px] md:object-cover md:z-20"
          />
        ) : (
          <p>No Image Available</p>
        )}
      </div>

      <div className="flex flex-col z-50 gap-3 md:gap-5 items-start px-5 md:px-0">
        <button className="bg-light px-4 py-1 rounded-[30px] font-semibold text-dark md:px-6 md:py-2">
          Trending
        </button>
        <h1 className="font-volkhov text-xl md:text-[36px] font-bold text-white">
          {tour.title}
        </h1>
        <div className="text-white md:flex items-center mt-2">
          <div className="flex items-center md:border-r md:border-white pr-4">
            <IoLocationSharp className="text-[16px] mr-1" />
            <p className="text-sm md:text-base">{tour.address}</p>
          </div>
          <div className="flex items-center ml-4">
            {renderStars()}
            <p className="ml-2 text-[12px] md:text-[14px]">
              {tour.rating || 0} ({tour.reviews ? tour.reviews.length : 0} reviews)
            </p>
          </div>
        </div>
        <p className="max-w-[300px] text-white md:max-w-[505px]">
          {tour.description}
        </p>
        <div className="flex gap-3 md:gap-10 mt-3 md:mt-5">
          <button
            className="bg-secondary z-50 relative cursor-pointer rounded-[40px] px-4 py-2 md:px-8 md:py-3 text-white shadow-custom-yellow"
            onClick={() => navigate("/tour", { state: { tour } })}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default CityFeature;