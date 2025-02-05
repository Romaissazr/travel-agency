import  { useEffect, useState } from "react";
import Profileheader from "../Components/Profileheader";
import SideBar from "../Components/SideBar";
import { Outlet } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/profile`,
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      navigate("/auth/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <p className="text-center font-semibold mt-3">Loading...</p>;
  }

  return (
    <div>
      <Profileheader />
      <div className="bg-[#F9FAFD] py-10 md:py-20 flex justify-center items-center min-h-screen">
        <div className="bg-white flex flex-col md:flex-row w-full max-w-6xl mx-4 md:mx-8 lg:mx-10">
          {user && (
            <SideBar
              firstName={user.firstName}
              lastName={user.lastName}
              location={user.address}
              birthd={user.dateBirth ? user.dateBirth.split("T")[0] : ""}
              avatar={user.avatar}
            />
          )}
          <div className="w-full md:w-[769px]">
            <Outlet context={{ user, setUser }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;