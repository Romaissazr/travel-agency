import { useState } from "react";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import alska from "../assets/Images/alska.jpg";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value) ? "Please enter a valid email" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/users/register`, payload);
      toast.success("Registration Successful");

      // Send OTP
      const otpPayload = { email };
      await axios.post(`${API_BASE_URL}/otp/send-otp`, otpPayload);
      toast.success("OTP Sent Successfully to your email!");

      navigate("/auth/otp", { state: { email } });
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(
          "An OTP was already sent. Please wait a few minutes before trying again."
        );
      } else if (err.response?.status === 500) {
        toast.error("Internal Server Error. Please try again later.");
      } else {
        toast.error("Failed to register or send OTP");
      }
      console.error("Error during registration or OTP sending:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${alska})` }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create Your Account
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Travel is the only purchase that enriches you in ways beyond
            material wealth.
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-secondary"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-secondary"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={`p-3 border rounded-lg w-full focus:outline-none focus:ring-2 ${
              emailError
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-secondary"
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />
          {emailError && (
            <p className="text-rose-500 text-sm mt-1">{emailError}</p>
          )}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(
                  e.target.value.length < 6
                    ? "Password must be at least 6 characters long"
                    : ""
                );
              }}
            />
            <span
              className="absolute right-3 top-4 text-gray-500 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <RxEyeOpen size={20} />
              ) : (
                <RxEyeClosed size={20} />
              )}
            </span>
            {passwordError && (
              <p className="text-rose-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-secondary"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(
                e.target.value !== password ? "Passwords do not match" : ""
              );
            }}
          />
          {confirmPasswordError && (
            <p className="text-rose-500 text-sm mt-1">{confirmPasswordError}</p>
          )}
          <button
            type="submit"
            className="py-3 px-6 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center flex justify-center text-gray-600 mt-6 text-sm md:text-base">
          <p>Already have an account?</p>
          <p
            className="text-secondary font-medium hover:underline cursor-pointer ml-2"
            onClick={() => navigate("/auth/")}
          >
            Sign In
          </p>
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

export default Signup;
