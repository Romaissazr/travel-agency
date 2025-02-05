import { useState, useRef, useEffect } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import NavBar from "./NavBar";

import intero from "../assets/Images/intero.mp4";
import watch from "../assets/Images/watch.svg";
import stop from "../assets/Images/stop.svg";
import axios from "axios";
import SearchBar from "./SearchBar";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Header() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [cities, setCities] = useState([]);

  const handlePlayPauseVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/city/`);
        if (response.data?.cities) {
          setCities(response.data.cities);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative h-[450px] md:h-[600px] mb-20">
      <NavBar />
      <video
        ref={videoRef}
        src={intero}
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        muted={!isMuted}
        loop
        autoPlay={false}
      />
      <div className="relative flex flex-col gap-6 md:gap-12 mt-12 md:mt-24 justify-center items-center text-center text-white z-10 px-4 md:px-0">
        <h1 className="text-2xl md:text-[48px] font-bold tracking-widest">
          We Find The Best Tours For You
        </h1>
        <p className="w-full md:w-[530px] font-medium">
          Explore the world&apos;s most stunning destinations with our
          expert-led tours. Creating unforgettable experiences for every
          traveler, every journey.
        </p>
        <div
          className="flex items-center gap-5 cursor-pointer"
          onClick={handlePlayPauseVideo}
        >
          <img
            src={isPlaying ? stop : watch}
            alt={isPlaying ? "Stop Icon" : "Watch Icon"}
            className="drop-shadow-2xl"
          />
          <p className="font-bold text-lg md:text-[25px] w-[120px] md:w-[170px]">
            {isPlaying ? "Stop Video" : "Watch Video"}
          </p>
        </div>
        {isPlaying && (
          <div
            className="flex items-center absolute -top-10 md:-top-32 right-4 md:right-10 gap-5 cursor-pointer z-20"
            onClick={handleMuteToggle}
          >
            {isMuted ? (
              <FaVolumeMute className="text-[24px] md:text-[30px] text-white" />
            ) : (
              <FaVolumeUp className="text-[24px] md:text-[30px] text-white" />
            )}
          </div>
        )}
      </div>
      <SearchBar cities={cities} />
    </div>
  );
}

export default Header;
