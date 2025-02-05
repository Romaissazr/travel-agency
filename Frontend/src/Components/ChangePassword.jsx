import  { useState } from "react";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";
import alska from "../assets/Images/alska.jpg";
import { useNavigate, useLocation } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  if (!email) {
    toast.error("No email provided.");
    navigate("/auth/forgot-password");
  }

 
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

 
  const validatePassword = (value) => {
    setPasswordError(
      value.length < 6 ? "Password must be at least 6 characters long" : ""
    );
  };

 
  const validateConfirmPassword = (value) => {
    setConfirmPasswordError(
      value !== newPassword ? "Passwords do not match" : ""
    );
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both new password and confirmation password.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/otp/verify-and-reset`, {
        email,
        newPassword,
      });
      toast.success("Password reset successfully.", {
        onClose: () => navigate("/auth/"),
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${alska})` }}
    >
      <div className="bg-white p-6 md:p-8 bg-opacity-90 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Reset Password
        </h2>
        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
          </div>
          {passwordError && (
            <p className="text-rose-500 text-sm mt-1">{passwordError}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateConfirmPassword(e.target.value);
              }}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {confirmPasswordError && (
            <p className="text-rose-500 text-sm mt-1">{confirmPasswordError}</p>
          )}

          <button
            type="button"
            onClick={handleResetPassword}
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-secondary text-white rounded-lg font-semibold ${
              isLoading ? "cursor-wait opacity-70" : "hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
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

export default ChangePassword;
