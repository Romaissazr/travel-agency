import { useEffect, useState } from "react";
import Slider from "react-slick";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Card from "./Card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useNavigate } from "react-router";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function CustomSlider() {
  const [activeArrow, setActiveArrow] = useState(null);
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (tour) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/tour`, { state: { tour } });
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tours/`);
      const featuredTours = response.data.data.filter((tour) => tour.featured);
      const toursWithCityNames = await Promise.all(
        featuredTours.map(async (tour) => {
          try {
            const cityResponse = await axios.get(
              `${API_BASE_URL}/city/${tour.city}`
            );
            return { ...tour, cityName: cityResponse.data.city.name };
          } catch (error) {
            console.error(`Error fetching city for tour ${tour._id}:`, error);
            return { ...tour, cityName: "Unknown City" };
          }
        })
      );
      setCards(toursWithCityNames);
    } catch (error) {
      console.error("Error fetching featured tours:", error.message || error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={() => {
        onClick();
        setActiveArrow("prev");
      }}
      className={`w-[40px] h-[40px] md:w-[50px] md:h-[50px] absolute rounded-full border shadow-lg border-secondary flex items-center justify-center cursor-pointer z-10 right-44 md:right-72 md:top-[-100px] top-[-50px]     transform -translate-y-1/2 ${
        activeArrow === "prev" ? "bg-secondary" : "bg-white"
      }`}
    >
      <IoIosArrowBack
        className={`text-[16px] md:text-[20px] ${
          activeArrow === "prev" ? "text-white" : "text-black"
        }`}
      />
    </div>
  );

  const NextArrow = ({ onClick }) => (
    <div
      onClick={() => {
        onClick();
        setActiveArrow("next");
      }}
      className={`w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full border shadow-lg border-secondary flex items-center justify-center cursor-pointer absolute z-10 right-32 md:right-56 md:top-[-100px] top-[-50px]  transform -translate-y-1/2 ${
        activeArrow === "next" ? "bg-secondary" : "bg-white"
      }`}
    >
      <IoIosArrowForward
        className={`text-[16px] md:text-[20px] ${
          activeArrow === "next" ? "text-white" : "text-black"
        }`}
      />
    </div>
  );

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-10 px-4 md:px-10 lg:px-20">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center md:text-left">
        Featured Destinations
      </h1>
      <div className="mt-20">
        {cards.length > 0 ? (
          <Slider {...settings}>
            {cards.map((card, index) => (
              <Card
                key={index}
                img={card.images[0]}
                cityName={card.cityName}
                description={card.title}
                duration={`${card.duration} hours`}
                price={card.price}
                reviews={card.reviews.length || 0}
                rating={card.rating || 0}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </Slider>
        ) : (
          <p className="text-center text-gray-500">
            No featured tours available.
          </p>
        )}
      </div>
    </div>
  );
}

export default CustomSlider;
