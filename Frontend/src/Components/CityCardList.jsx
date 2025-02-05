import { FaRegClock, FaStar } from "react-icons/fa";
import { LiaCarSideSolid } from "react-icons/lia";
import { HiUsers } from "react-icons/hi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function CityCardList({
  rating,
  reviews,
  imageSrc,
  title,
  price,
  duration,
  onClick,
}) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <div
      className="w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="flex flex-col  lg:flex-row">
        <div className="w-full  lg:w-[150px] h-[150px] flex-shrink-0">
          <img
            src={`${API_BASE_URL}/uploads/${imageSrc.split("\\").pop()}`}
            alt={title || "Tour Image"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex-grow">
          <h3 className="text-lg font-bold text-gray-800">
            {title || "Tour Title"}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">{renderStars()}</div>
            <p className="text-sm text-gray-600">
              {reviews} {reviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-700">
            <div className="flex items-center gap-1">
              <FaRegClock />
              <p className="text-sm">{duration || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1">
              <LiaCarSideSolid />
              <p className="text-sm">Transport</p>
            </div>
            <div className="flex items-center gap-1">
              <HiUsers />
              <p className="text-sm">Family Plan</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 sm:p-6 border-t sm:border-t-0 sm:border-l border-gray-200">
          <p className="text-gray-500 text-sm">Per Person</p>
          <p className="text-xl font-bold text-primary">${price || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export default CityCardList;
