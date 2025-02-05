import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [canceledBookings, setCanceledBookings] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPayments, setTotalPayments] = useState(0);
  const [paidPayments, setPaidPayments] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bookings/`);
        const bookingsData = response.data.bookings;

        setBookings(bookingsData);
        setTotalBookings(bookingsData.length);
        setCanceledBookings(
          bookingsData.filter((booking) => booking.status === "cancelled")
            .length
        );
        setConfirmedBookings(
          bookingsData.filter((booking) => booking.status === "confirmed")
            .length
        );

        let total = 0;
        let paid = 0;
        let pending = 0;

        bookingsData.forEach((booking) => {
          total += booking.totalPrice || 0;
          if (booking.paymentStatus === "paid") {
            paid += booking.totalPrice || 0;
          } else if (booking.paymentStatus === "pending") {
            pending += booking.totalPrice || 0;
          }
        });

        setTotalPayments(total);
        setPaidPayments(paid);
        setPendingPayments(pending);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      case "failed":
        return "text-rose-600 bg-rose-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-rose-600 bg-rose-100";
      case "pending":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const bookingStatusBarChartData = [
    { name: "Confirmed", value: confirmedBookings },
    { name: "Canceled", value: canceledBookings },
    {
      name: "Pending",
      value: totalBookings - confirmedBookings - canceledBookings,
    },
  ];

  const bookingStatusPieChartData = [
    { name: "Confirmed", value: confirmedBookings },
    { name: "Canceled", value: canceledBookings },
    {
      name: "Pending",
      value: totalBookings - confirmedBookings - canceledBookings,
    },
  ];

  const paymentStatusBarChartData = [
    { name: "Paid", value: paidPayments },
    { name: "Pending", value: pendingPayments },
  ];

  const paymentStatusPieChartData = [
    { name: "Paid", value: paidPayments },
    { name: "Pending", value: pendingPayments },
  ];

  const COLORS = ["#10B981", "#EF4444", "#F59E0B"];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Booking Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Total Bookings
          </h4>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
            {totalBookings}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Canceled Bookings
          </h4>
          <p className="text-2xl sm:text-3xl font-bold text-rose-600">
            {canceledBookings}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Confirmed Bookings
          </h4>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {confirmedBookings}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Booking Payments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Total Payments
            </h4>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              ${totalPayments.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Paid Payments
            </h4>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              ${paidPayments.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Pending Payments
            </h4>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">
              ${pendingPayments.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Booking Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingStatusBarChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Booking Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusPieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {bookingStatusPieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStatusBarChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Payment Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusPieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {paymentStatusPieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          All Bookings
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left text-gray-700">Booking ID</th>
              <th className="py-3 text-left text-gray-700">Tour ID</th>
              <th className="py-3 text-left text-gray-700">User ID</th>
              <th className="py-3 text-left text-gray-700">Date From</th>
              <th className="py-3 text-left text-gray-700">Date To</th>
              <th className="py-3 text-left text-gray-700">Group Size</th>
              <th className="py-3 text-left text-gray-700">Total Price</th>
              <th className="py-3 text-left text-gray-700">Payment Status</th>
              <th className="py-3 text-left text-gray-700">Booking Status</th>
              <th className="py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="py-3">#{booking._id}</td>
                <td className="py-3">{booking.tour?._id || "N/A"}</td>{" "}
                {/* Check if tour exists */}
                <td className="py-3">{booking.user?._id || "N/A"}</td>{" "}
                {/* Check if user exists */}
                <td className="py-3">
                  {new Date(booking.dateFrom).toLocaleDateString()}
                </td>
                <td className="py-3">
                  {new Date(booking.dateTo).toLocaleDateString()}
                </td>
                <td className="py-3">{booking.groupSize}</td>
                <td className="py-3">
                  ${booking.totalPrice?.toLocaleString()}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-md ${getPaymentStatusColor(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-md ${getBookingStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/bookings/update`, {
                        state: { booking },
                      })
                    }
                    className="text-sm bg-sky-100 text-sky-600 px-2 py-1 rounded-md hover:bg-sky-200"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Booking;
