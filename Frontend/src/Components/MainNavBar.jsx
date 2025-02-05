import  { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import logo from "../assets/Images/darklogo.svg";
import Button from "./Button";
import { FiMenu, FiX } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
function MainNavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const header = {
        headers: { Authorization: `Bearer ${JSON.parse(token)}` },
      };
      const response = await axios.post(
        `${API_BASE_URL}/users/profile`,
        {},
        header
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

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth/");
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setShowDropdown(false);
  };

  const avatarUrl = user?.avatar
    ? `${API_BASE_URL}${user.avatar}`
    : `${API_BASE_URL}/uploads/avatarpfp.jpg`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16 bg-transparent text-white">
        Loading...
      </div>
    );
  }

  return (
    <nav className="flex justify-between p-6 items-center bg-transparent relative">
      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        className="cursor-pointer w-28 md:w-32"
        onClick={() => navigate("/")}
      />

      <div
        className="lg:hidden text-dark text-2xl cursor-pointer"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>

     
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={closeMenu}
        ></div>
      )}

      
      <ul
        className={`lg:flex lg:gap-10 lg:items-center text-white lg:text-dark font-semibold 
          absolute lg:static top-16 right-0 bg-darkBlue  lg:bg-transparent w-full lg:w-auto 
          p-10 lg:p-0 transition-all flex flex-col lg:flex-row justify-center items-center 
          space-y-6 lg:space-y-0 ${menuOpen ? 'block' : 'hidden'} z-50`}
      >
        
        {user && (
          <>
            <li className="lg:hidden flex items-center gap-2">
              <img
                src={avatarUrl}
                alt="Profile Icon"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <p className="capitalize">{user.firstName}</p>
              <p className="capitalize">{user.lastName}</p>
            </li>
            <div className="h-[1px] w-full bg-light lg:hidden"></div>
            <li className="lg:hidden">
              <p
                className="cursor-pointer hover:text-secondary transition-colors py-2"
                onClick={() => {
                  navigate(`/tour/profile`, { state: { user } });
                  closeMenu();
                }}
              >
                Profile
              </p>
            </li>
            <li className="lg:hidden">
              <p
                className="cursor-pointer hover:text-secondary transition-colors py-2"
                onClick={handleSignOut}
              >
                Log Out
              </p>
            </li>
          </>
        )}

        
        <li>
          <p
            className="cursor-pointer hover:text-secondary transition-colors"
            onClick={() => {
              navigate("/");
              closeMenu();
            }}
          >
            Home
          </p>
        </li>
        <li>
          <a
            href="#"
            className="hover:text-secondary transition-colors"
            onClick={closeMenu}
          >
            About Us
          </a>
        </li>
        <li>
          <p
            className="cursor-pointer hover:text-secondary transition-colors"
            onClick={() => {
              navigate("/tour/destination");
              closeMenu();
            }}
          >
            Popular Destinations
          </p>
        </li>
        <li>
          <a
            href="#"
            className="hover:text-secondary transition-colors"
            onClick={closeMenu}
          >
            Our Packages
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:text-secondary transition-colors"
            onClick={closeMenu}
          >
            Help
          </a>
        </li>

        
        {user && (
          <li className="hidden lg:block relative">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-secondary transition-colors"
              onClick={toggleDropdown}
            >
              <img
                src={avatarUrl}
                alt="Profile Icon"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <p className="capitalize">{user.firstName}</p>
              <IoIosArrowDown />
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/tour/profile`, { state: { user } });
                      closeMenu();
                    }}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={handleSignOut}
                  >
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </li>
        )}

      
        {!user && (
          <li>
            <Button
              text="Sign In"
              onClick={() => {
                navigate("/auth/");
                closeMenu();
              }}
            />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default MainNavBar;