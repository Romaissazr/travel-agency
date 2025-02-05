import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import alska from "../assets/Images/alska.jpg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!emailRegex.test(value) ? "Please enter a valid email" : "");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });
      const { user, token } = response.data;

      if (user.verified) {
        toast.success("Login successful!");
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(user));
        setIsVerified(true);

        const { from, tour, bookingDetails } = location.state || {};
        if (from === "/tour/confirm") {
          navigate("/tour/confirm", { state: { tour, bookingDetails } });
        } else if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setIsVerified(false);
        toast.error("Your account is not verified.");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          error.response.data.message || "Your account is not verified."
        );
        setIsVerified(false);
      } else {
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`${API_BASE_URL}/otp/send-otp`, { email });
      toast.success("OTP sent successfully. Please check your email.");
      navigate("/auth/otp", { state: { email } });
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${alska})` }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base">
            Travel is the only purchase that enriches you in ways beyond
            material wealth.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base"
              required
            />
            {emailError && (
              <p className="text-rose-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-secondary text-sm sm:text-base"
              required
            />
            <span
              className="absolute right-3 top-3.5 text-gray-500 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <RxEyeOpen size={20} />
              ) : (
                <RxEyeClosed size={20} />
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rememberMe" className="w-4 h-4" />
              <label htmlFor="rememberMe" className="text-gray-600 text-sm">
                Remember Me
              </label>
            </div>
            <p
              className="cursor-pointer text-gray-700 font-semibold hover:underline hover:text-sky-600 text-sm sm:text-base"
              onClick={() => navigate("/auth/email")}
            >
              Forgot Password?
            </p>
          </div>

          <button
            type="submit"
            className="py-3 px-6 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {isVerified === false && (
          <div className="text-center text-rose-500 mt-4 text-sm sm:text-base">
            <p>
              Your account is not verified.{" "}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={handleSendOtp}
              >
                Click here to verify your email
              </span>
            </p>
          </div>
        )}

        <div className="text-center text-gray-600 mt-6 text-sm sm:text-base">
          <p>
            Don’t have an account?{" "}
            <span
              className="text-secondary font-medium hover:underline cursor-pointer"
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </span>
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

export default Login;
