import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import alska from "../assets/Images/alska.jpg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function EmailSearch() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value) ? "Please enter a valid email" : "");
  };

  const handleSearch = async () => {
    if (!email) {
      setEmailError("Please enter an email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/users/search-email`, {
        params: { email },
      });

      if (response.status === 200 && response.data.status) {
        toast.success("Email found. Sending OTP...");

        await axios.post(`${API_BASE_URL}/otp/send-otp`, { email });
        toast.success("OTP sent successfully.");

        navigate("/auth/otp-password", { state: { email } });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Email not found.");
      } else {
        console.error("Error during API call:", error);
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${alska})` }}
    >
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm bg-opacity-90">
        <h2 className="text-2xl font-semibold text-center mb-4 md:mb-6 text-gray-700">
          Forgot Password
        </h2>
        <p className="text-center mb-4 text-gray-500 text-sm md:text-base">
          Enter your email address to reset your password.
        </p>
        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {emailError && (
            <p className="text-rose-500 text-sm mt-1">{emailError}</p>
          )}
          <button
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-secondary text-white rounded-lg font-semibold ${
              isLoading ? "cursor-wait opacity-70" : ""
            }`}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <a href="/auth/" className="text-sky-500 hover:underline">
            Login
          </a>
        </p>
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

export default EmailSearch;
