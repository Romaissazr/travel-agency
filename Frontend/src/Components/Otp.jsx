import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import alska from "../assets/Images/alska.jpg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || null;


  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length === otp.length) {
      const newOtp = [...pastedData].slice(0, otp.length);
      setOtp(newOtp);

      const lastInput = document.getElementById(`otp-input-${otp.length - 1}`);
      if (lastInput) lastInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpCode = otp.join("");

    try {
      const response = await fetch(`${API_BASE_URL}/otp/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpCode, email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP verified successfully!");
        setTimeout(() => navigate("/auth/"), 3000);
      } else {
        console.error("Error:", data.message);
        toast.error(data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <div className="flex gap-2 md:gap-3 items-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                maxLength={1}
                className="w-10 h-10 md:w-12 md:h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="-"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`h-12 px-5 py-3 bg-secondary text-white font-semibold rounded-lg mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "cursor-wait" : "cursor-pointer"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={isResending}
          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
        >
          {isResending ? "Resending..." : "Resend Code"}
        </button>

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
    </div>
  );
}

export default Otp;
