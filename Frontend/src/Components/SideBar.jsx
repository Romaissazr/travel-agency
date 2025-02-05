import { useState } from "react";
import { FaPen } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { useNavigate, useOutletContext } from "react-router";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SideBar({ firstName, lastName, location, birthd, avatar }) {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const setUser = outletContext?.setUser;
  const [activeButton, setActiveButton] = useState("profile");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.put(
          `${API_BASE_URL}/users/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token)}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200 && setUser) {
          setUser((prevUser) => ({
            ...prevUser,
            avatar: response.data.data.avatar,
          }));
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const handleNavigation = (button, path) => {
    setActiveButton(button);
    navigate(path);
  };

  return (
    <div className="w-full md:w-[400px] flex flex-col items-center gap-8 h-full border-b md:border-r p-6 md:p-10">
      <div className="relative w-[180px] pt-10 pb-5">
        <img
          src={`${API_BASE_URL}${avatar}`}
          alt="User Avatar"
          className="w-[180px] h-[180px] rounded-full"
        />
        <label className="absolute bottom-7 right-0 w-9 h-9 bg-primary rounded-full flex items-center justify-center cursor-pointer">
          <FaPen className="text-white" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <div className="flex gap-3 text-[22px] font-bold">
        <h1>{firstName}</h1>
        <h1>{lastName}</h1>
      </div>
      <div className="flex items-center text-[15px] px-6 text-dark justify-between w-full">
        <span className="flex items-center gap-1">
          <IoLocationSharp />
          <p>{location}</p>
        </span>
        <span className="flex items-center gap-1">
          <LiaBirthdayCakeSolid />
          <p>{birthd}</p>
        </span>
      </div>
      <div className="w-full mt-10">
        <button
          className={`w-full py-5 pl-5 text-left cursor-pointer hover:bg-primary hover:text-white ${
            activeButton === "profile" ? "bg-primary text-white" : ""
          }`}
          onClick={() => handleNavigation("profile", "/tour/profile/")}
        >
          Profile Information
        </button>
        <button
          className={`w-full py-5 pl-5 text-left cursor-pointer hover:bg-primary hover:text-white ${
            activeButton === "history" ? "bg-primary text-white" : ""
          }`}
          onClick={() => handleNavigation("history", "/tour/profile/history")}
        >
          Booking History
        </button>
        <button
          className={`w-full py-5 pl-5 text-left cursor-pointer hover:bg-primary hover:text-white ${
            activeButton === "newsletter" ? "bg-primary text-white" : ""
          }`}
          onClick={() =>
            handleNavigation("newsletter", "/tour/profile/newsletter")
          }
        >
          Newsletter
        </button>
      </div>
    </div>
  );
}

export default SideBar;
