import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "../assets/Images/mastercard.png";
import img2 from "../assets/Images/bitpay.png";
import img3 from "../assets/Images/visa.png";
import img4 from "../assets/Images/express.png";
import img5 from "../assets/Images/discover.png";
import img6 from "../assets/Images/sofort.png";
import img7 from "../assets/Images/google.png";
import img8 from "../assets/Images/apple.png";
import img9 from "../assets/Images/paypal.png";
import img10 from "../assets/Images/maestro.png";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Payment() {
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUser(storedUser);
    } else {
      toast.error("User information is missing. Please log in again.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id || !bookingId) {
      toast.error("User or Booking information is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/${bookingId}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentStatus: "paid" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update payment status");
      }

      toast.success("Payment status updated successfully!");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Payment Details
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {[img1, img2, img3, img4, img5, img6, img7, img8, img9, img10].map(
            (img, index) => (
              <img key={index} src={img} alt="Payment Method" className="h-8" />
            )
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Holder Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md "
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
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

export default Payment;
