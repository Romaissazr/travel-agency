import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
function Gallery() {
  const [featuredImages, setFeaturedImages] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFeaturedImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/gallery/featured`);
        setFeaturedImages(response.data.data);
      } catch (error) {
        console.error("Error fetching featured images:", error);
      }
    };

    fetchFeaturedImages();
  }, []);

  return (
    <div className="py-10 px-4 md:px-20">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-[36px] font-bold font-volkhov">From The Gallery</h1>
          <p className="max-w-[300px] md:max-w-[538px] text-[14px] md:text-[16px] opacity-70 font-semibold text-dark">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
          </p>
        </div>
        <button className="p-3 md:p-4 text-white bg-dark mt-4 md:mt-0"
        onClick={()=>{navigate('/tour/gallery')}}
        >View All Images</button>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 my-8 md:my-16">
        {featuredImages.length > 0 ? (
          featuredImages.map((image) => (
            <img
              key={image._id}
              src={`${API_BASE_URL}/uploads/${image.images[0]}`}
              alt={image.title}
              className="w-full h-auto"
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-4">No featured images available.</p>
        )}
      </div>
    </div>
  );
}

export default Gallery;
