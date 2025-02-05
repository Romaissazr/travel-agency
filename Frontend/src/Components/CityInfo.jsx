import MiniCard from "./MiniCard";
import { IoIosBus } from "react-icons/io";
import { FaEarthAfrica } from "react-icons/fa6";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { TiLocationArrowOutline } from "react-icons/ti";
import { BiTaxi } from "react-icons/bi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function CityInfo({ img, name, desc }) {
  const imageUrl = `${API_BASE_URL}/uploads/${img.split("\\").pop()}`;

  return (
    <div className="relative flex flex-col items-center justify-center w-full ">
      <img
        src={imageUrl}
        alt={name || "City Image"}
        className="w-full h-[300px] md:h-[500px] object-cover"
      />

      <div className="absolute top-[100%] md:top-[70%] left-1/2 transform -translate-x-1/2 w-full max-w-full md:max-w-[1110px] md:px-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-start shadow-lg px-6 md:px-10 py-6 md:py-5 bg-white rounded-lg">
          <div className="w-full md:w-[560px]">
            <h1 className="text-3xl md:text-[64px] font-bold font-volkhov tracking-wide">
              {name || "Unknown City"}
            </h1>
            <p className="text-dark mt-5 text-sm md:text-[16px]">
              {desc || "No description available for this city."}
            </p>
          </div>

          <div className="w-full ">
            <div className="md:mb-5">
              <MiniCard
                img={<IoIosBus />}
                text="Public Transportations"
                colorClass="text-purple"
              />
            </div>
            <div className="md:flex gap-5 md:mb-5">
              <MiniCard
                img={<FaEarthAfrica />}
                text="Nature & Adventure"
                colorClass="text-primary"
              />
              <MiniCard
                img={<BiTaxi />}
                text="Private Transportations"
                colorClass="text-yellow"
              />
            </div>
            <div className="md:flex gap-5">
              <MiniCard
                img={<MdOutlineBusinessCenter />}
                text="Business Tours"
                colorClass="text-red"
              />
              <MiniCard
                img={<TiLocationArrowOutline />}
                text="Local Visit"
                colorClass="text-blue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityInfo;
