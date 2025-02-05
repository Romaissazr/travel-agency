import { FaRegClock, FaStar } from "react-icons/fa";
import { LiaCarSideSolid } from "react-icons/lia";
import { HiUsers } from "react-icons/hi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Card({
  img,
  cityName,
  description,
  duration,
  price,
  reviews,
  rating,
  onClick,
}) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow" : "text-[#CFD9DE]"}
        />
      );
    }
    return stars;
  };

  return (
    <div
      className="bg-white shadow-md text-start w-[330px] md:w-[215px] lg:w-[250px]   cursor-pointer transition-all ease-in-out duration-300 hover:shadow-xl hover:scale-105"
      onClick={onClick}
    >
      <img
        src={`${API_BASE_URL}/uploads/${img.split("\\").pop()}`}
        alt="Tour"
        className="p-5 h-[300px] md:h-[210px] w-full object-cover"
      />
      <div className="border-b px-5 py-2">
        <h1 className="md:h-[65px]">
          {cityName}: {description}
        </h1>
        <div className="flex items-center gap-2  mt-2 text-[14px] md:text-[15px] text-dark">
          <FaRegClock />
          <p>Duration {duration}</p>
        </div>
        <div className="flex items-center gap-2 text-[14px] md:text-[15px] text-dark">
          <LiaCarSideSolid />
          <p>Transport Facility</p>
        </div>
        <div className="flex items-center gap-2 mb-2 text-[14px] md:text-[15px] text-dark">
          <HiUsers />
          <p>Family Plan</p>
        </div>
      </div>
      <div className="flex px-5 pt-2 items-center justify-between">
        <div className="flex gap-1">{renderStars()}</div>
        <p className="text-primary font-bold text-lg md:text-[20px]">
          ${price}
        </p>
      </div>
      <div className="flex px-5 pb-2 text-[12px] md:text-[14px] items-center text-dark justify-between">
        <p>
          {reviews} {reviews === 1 ? "review" : "reviews"}
        </p>
        <p>per person</p>
      </div>
    </div>
  );
}

export default Card;
