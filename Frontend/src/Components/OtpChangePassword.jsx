import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import alska from "../assets/Images/alska.jpg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function OtpChangePassword() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  if (!email) {
    toast.error("No email provided.");
    navigate("/auth/forgot-password");
  }

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text");
    if (pastedValue.length === 6 && !isNaN(pastedValue)) {
      const newOtp = pastedValue.split("");
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/otp/verify-otp`, {
        email,
        otp: enteredOtp,
      });
      toast.success("OTP verified successfully.");
      navigate("/auth/change-password", { state: { email } });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP or verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/otp/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP resent successfully!");
      } else {
        console.error("Error:", data.message);
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred while resending OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${alska})` }}
    >
      <div className="bg-white bg-opacity-90 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Verify OTP
        </h2>
        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 md:w-12 md:h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-secondary text-white rounded-lg font-semibold ${
              isLoading ? "cursor-wait opacity-70" : "hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <button
          onClick={handleResend}
          disabled={isResending}
          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
        >
          {isResending ? "Resending..." : "Resend Code"}
        </button>
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

export default OtpChangePassword;
