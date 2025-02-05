import { useState } from "react";
import { useLocation } from "react-router";
import { IoLocationSharp } from "react-icons/io5";
import { FaHeadSideVirus, FaStar } from "react-icons/fa";
import TourHighlights from "../Components/TourHighlights";
import { MdBlockFlipped, MdOutlineHealthAndSafety } from "react-icons/md";
import { AiFillThunderbolt, AiOutlineMobile } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import BookingForm from "../Components/BookingForm";
import Comments from "../Components/Comments";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
function TourDetails() {
  const location = useLocation();
  const [data] = useState(location.state?.tour || {});
  const [selectedImage, setSelectedImage] = useState(data.images?.[0]);

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={index < data.rating ? "text-yellow" : "text-[#CFD9DE]"}
      />
    ));
  };

  const highlights = [
    {
      icon: MdBlockFlipped,
      title: "Free cancellation",
      desc: "Cancel up to 24 hours in advance to receive a full refund",
    },
    {
      icon: MdOutlineHealthAndSafety,
      title: "Health precautions",
      desc: "Special health and safety measures apply. Learn more",
    },
    {
      icon: AiOutlineMobile,
      title: "Mobile ticketing",
      desc: "Use your phone or print your voucher",
    },
    {
      icon: IoMdTime,
      title: `Duration ${data.duration} hours`,
      desc: "Check availability to see starting times.",
    },
    {
      icon: AiFillThunderbolt,
      title: "Instant confirmation",
      desc: "Don’t wait for the confirmation!",
    },
    {
      icon: FaHeadSideVirus,
      title: "Live tour guide in English",
      desc: "English",
    },
  ];

  const handleConfirmBooking = (bookingDetails) => {
   
  };

  if (!data) {
    return <div>No tour data found.</div>;
  }

  const formattedRating = parseFloat(data.rating).toFixed(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
 
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
      
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-volkhov font-bold">
            {data.title}
          </h1>

      
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mt-4 text-sm sm:text-base">
            <span className="flex items-center gap-1">
              <IoLocationSharp /> <p>{data.address}</p>
            </span>
            <div className="flex items-center">
              {renderStars()}
              <p className="ml-2">
                {formattedRating || 0} ({data.reviews?.length || 0} reviews)
              </p>
            </div>
          </div>

        
          <div className="mt-6">
            <img
              src={`${API_BASE_URL}/uploads/${selectedImage
                ?.split("\\")
                .pop()}`}
              alt="Tour"
              className="w-full h-72  md:h-80 lg:h-96 object-cover rounded-lg"
            />
          </div>

        
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
            {data.images?.map((image, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}/uploads/${image.split("\\").pop()}`}
                alt={`Tour Image ${index + 1}`}
                className="cursor-pointer h-20 sm:h-20 w-full object-cover rounded-lg"
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>

      
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {highlights.map((highlight, index) => (
              <TourHighlights
                key={index}
                icon={highlight.icon}
                title={highlight.title}
                desc={highlight.desc}
              />
            ))}
          </div>

        
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-volkhov font-bold">
              Description
            </h2>
            <p className="mt-2 text-sm sm:text-base">{data.description}</p>
          </div>

       
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-volkhov font-bold">Activity</h2>
            <ul className="mt-2 ml-4">
              {data.activity?.map((activity, index) => (
                <li
                  className="list-disc text-sm sm:text-base my-1"
                  key={index}
                >
                  {activity}
                </li>
              ))}
            </ul>
          </div>

        
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-volkhov font-bold">
              What is included / not included
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 mt-4">
              <div className="w-full sm:w-1/2">
                <h3 className="text-lg font-volkhov font-bold">Included</h3>
                <ul className="ml-4">
                  {data.included?.map((item, index) => (
                    <li
                      className="list-disc text-sm sm:text-base my-1"
                      key={index}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:w-1/2">
                <h3 className="text-lg font-volkhov font-bold">Not Included</h3>
                <ul className="ml-4">
                  {data.notIncluded?.map((item, index) => (
                    <li
                      className="list-disc text-sm sm:text-base my-1"
                      key={index}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

       
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-volkhov font-bold">Safety</h2>
            <ul className="mt-2 ml-4">
              <li className="list-disc text-sm sm:text-base">{data.safety}</li>
            </ul>
          </div>

       
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-volkhov font-bold">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <h3 className="text-lg font-volkhov font-bold">Language</h3>
                <ul className="ml-4">
                  {data.language?.map((item, index) => (
                    <li
                      className="list-disc text-sm sm:text-base my-1"
                      key={index}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-volkhov font-bold">Duration</h3>
                <ul className="ml-4">
                  <li className="list-disc text-sm sm:text-base">
                    {data.duration} hours
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-volkhov font-bold">Max Group Size</h3>
                <ul className="ml-4">
                  <li className="list-disc text-sm sm:text-base">
                    {data.maxGroupSize} people
                  </li>
                </ul>
              </div>
            </div>
          </div>

        
          <div className="mt-6">
            <h2 className="text-xl sm:text-2xl font-volkhov font-bold">
              Meeting Point
            </h2>
            <p className="mt-2 text-sm sm:text-base">
              Meet your guide at {data.meetingPoint?.address}. Look for a guide
              wearing SMT attire and holding a red SMT flag.
            </p>
            <a
              href={`https://www.google.com/maps?q=${data.meetingPoint?.address}`}
              className="text-primary underline font-bold mt-2 inline-block"
            >
              Open in Google Maps
            </a>
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3115.9308039262126!2d${
                data.meetingPoint?.coordinates?.longitude - 0.001
              }!3d${
                data.meetingPoint?.coordinates?.latitude
              }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzMyLjEiTiA3M8KwNTknMDYuNCJX!5e0!3m2!1sen!2s!4v1616511791364!5m2!1sen!2s`}
              width="100%"
              height="300"
              className="mt-4 rounded-lg"
              allowFullScreen
              loading="lazy"
              style={{ border: "0" }}
            ></iframe>
          </div>
        </div>

     
        <div className="w-full lg:w-1/3">
          <BookingForm data={data} onConfirmBooking={handleConfirmBooking} />
        </div>
      </div>

    
      <div className="mt-8">
        <Comments
          rating={data.rating}
          reviews={data.reviews?.length || 0}
          tourId={data._id}
        />
      </div>
    </div>
  );
}

export default TourDetails;