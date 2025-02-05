import { useState } from "react";
import logo from "../assets/Images/darklogo.svg";
import { useNavigate } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";

function AdminNavBar() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="sm:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-lg shadow-md focus:outline-none"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-40  bg-white shadow-md transform transition-transform duration-300 ease-in-out sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className=" cursor-pointer"
              onClick={() => navigate("/admin")}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                navigate("/admin");
                setIsSidebarOpen(false);
              }}
            >
              Dashboard
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                navigate("/admin/bookings");
                setIsSidebarOpen(false);
              }}
            >
              Bookings
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                navigate("/admin/customers");
                setIsSidebarOpen(false);
              }}
            >
              Customers
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                navigate("/admin/cities");
                setIsSidebarOpen(false);
              }}
            >
              Cities
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                navigate("/admin/gallery-dashboard");
                setIsSidebarOpen(false);
              }}
            >
              Gallery
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                navigate("/admin/tours");
                setIsSidebarOpen(false);
              }}
            >
              Tours
            </p>
          </div>

          <div className="mt-auto">
            <p
              className="text-gray-700 hover:text-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              Log Out
            </p>
          </div>
        </div>
      </div>

      <div className="hidden sm:block bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 cursor-pointer"
              onClick={() => navigate("/admin")}
            />
          </div>

          <div className="flex items-center space-x-6">
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate("/admin")}
            >
              Dashboard
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate("/admin/bookings")}
            >
              Bookings
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate("/admin/customers")}
            >
              Customers
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate("/admin/cities")}
            >
              Cities
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => navigate("/admin/tours")}
            >
              Tours
            </p>
            <p
              className="text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                navigate("/admin/gallery-dashboard");
              }}
            >
              Gallery
            </p>
          </div>

          <div className="flex items-center">
            <p
              className="text-gray-700 hover:text-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              Log Out
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminNavBar;
