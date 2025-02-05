import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function PersonalInformation() {
  const { user: parentUser, setUser } = useOutletContext();
  const [user, setLocalUser] = useState({
    firstName: "",
    lastName: "",
    dateBirth: "",
    phone: "",
    address: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setLocalUser(parentUser);
  }, [parentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePersonalInfoSubmit = async () => {
    if (!user.firstName.trim() || !user.lastName.trim()) {
      toast.error("First Name and Last Name are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    try {
      const updatedUser = {
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        dateBirth: user.dateBirth,
        phone: user.phone,
        address: user.address,
      };

      const response = await axios.put(
        `${API_BASE_URL}/users/update`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Personal information updated successfully!");
        setLocalUser(response.data.data);
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error updating personal information:", error);
      toast.error("Failed to update personal information.");
    }
  };

  const handleEmailSubmit = async () => {
    if (!user.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    try {
      const updatedUser = {
        email: user.email.trim(),
      };

      const response = await axios.put(
        `${API_BASE_URL}/users/update-email`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Email updated successfully!");
        setLocalUser({ ...user, email: updatedUser.email });
      }
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email.");
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.oldPassword.trim() || !passwordData.newPassword.trim()) {
      toast.error("Both old and new passwords are required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    try {
      const updatedPassword = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };

      const response = await axios.put(
        `${API_BASE_URL}/users/update-passwor`,
        updatedPassword,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setPasswordData({ oldPassword: "", newPassword: "" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    }
  };

  return (
    <div className="w-full py-6 md:py-10 px-4 md:px-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Personal Information
      </h1>

      <div className="space-y-6 border-b py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="First Name"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="dateBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dateBirth"
              name="dateBirth"
              value={user.dateBirth || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Phone Number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Address"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePersonalInfoSubmit}
            className="py-3 px-10 text-white bg-primary rounded-md focus:outline-none"
          >
            Save Personal Information
          </button>
        </div>
      </div>

      <div className="space-y-6 py-6 md:py-10">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email Address"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handleEmailSubmit}
              className="py-3 px-10 text-white bg-primary rounded-md focus:outline-none"
            >
              Save Email
            </button>
          </div>
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Old Password"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="New Password"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePasswordSubmit}
            className="py-3 px-10 text-white bg-primary rounded-md focus:outline-none"
          >
            Save Password
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default PersonalInformation;
