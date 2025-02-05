import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Dashboard() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [activeTours, setActiveTours] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentTours, setRecentTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const fetchCityName = async (cityId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/city/${cityId}`);
      return response.data.city?.name || "N/A";
    } catch (error) {
      console.error("Error fetching city name:", error);
      return "N/A";
    }
  };

  const fetchDashboardData = async () => {
    try {
      const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings/`);
      const bookings = bookingsResponse.data.bookings || [];
      setTotalBookings(bookings.length);

      const totalRevenue = bookings
        .filter((booking) => booking.paymentStatus === "paid")
        .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
      setRevenue(totalRevenue);

      const sortedRecentBookings = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(sortedRecentBookings);

      const toursResponse = await axios.get(`${API_BASE_URL}/tours/`);
      const tours = toursResponse.data.data || [];

      const activeToursCount = tours.filter(
        (tour) => tour.status === "active"
      ).length;
      setActiveTours(activeToursCount);

      const sortedRecentTours = tours
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const toursWithCityNames = await Promise.all(
        sortedRecentTours.map(async (tour) => {
          const cityName = await fetchCityName(tour.city);
          return { ...tour, cityName };
        })
      );

      setRecentTours(toursWithCityNames);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const barChartData = [
    { name: "Total Bookings", value: totalBookings },
    { name: "Active Tours", value: activeTours },
  ];

  const pieChartData = [
    { name: "Active Tours", value: activeTours },
    { name: "Inactive Tours", value: recentTours.length - activeTours },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-rose-600">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Welcome Back, {user?.firstName} {user?.lastName}!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-700">
            Total Bookings
          </h4>
          <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-700">Active Tours</h4>
          <p className="text-2xl font-bold text-green-600">{activeTours}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-700">Revenue</h4>
          <p className="text-2xl font-bold text-purple-600">
            ${revenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Tour Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
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

      <div className="bg-white rounded-lg shadow-md p-4 mb-8 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
        <div className="min-w-[600px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Booking ID</th>
                <th className="py-2 text-left">Customer</th>
                <th className="py-2 text-left">Tour</th>
                <th className="py-2 text-left">Booking Date</th>

                <th className="py-2 text-left">Date </th>
                <th className="py-2 text-left">Group Size</th>
                <th className="py-2 text-left">Payment Status</th>
                <th className="py-2 text-left">Total Price</th>
                <th className="py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">#{booking._id}</td>
                  <td className="py-2">
                    {booking.user?.firstName || "N/A"}{" "}
                    {booking.user?.lastName || "N/A"}
                  </td>
                  <td className="py-2">{booking.tour?.title || "N/A"}</td>
                  <td className="py-2">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {new Date(booking.selectedDate).toLocaleDateString()}
                  </td>

                  <td className="py-2">{booking.groupSize || "N/A"}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2">${booking.totalPrice || 0}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-600"
                          : booking.status === "pending"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Recent Tours</h3>
        <div className="min-w-[600px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Tour ID</th>
                <th className="py-2 text-left">Title</th>
                <th className="py-2 text-left">City</th>
                <th className="py-2 text-left">Image</th>
                <th className="py-2 text-left">Price</th>
                <th className="py-2 text-left">Dates</th>
                <th className="py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTours.map((tour) => {
                return (
                  <tr key={tour._id} className="border-b hover:bg-gray-50">
                    <td className="py-2">#{tour._id}</td>
                    <td className="py-2">{tour.title || "N/A"}</td>
                    <td className="py-2">{tour.cityName || "N/A"}</td>
                    <td className="py-2">
                      <img
                        src={`${API_BASE_URL}/uploads/${tour.images?.[0]
                          ?.split("\\")
                          .pop()}`}
                        alt={tour.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="py-2">${tour.price || 0}</td>
                    <td className="py-2">
                      {tour.availableDates && tour.availableDates.length > 0 ? (
                        tour.availableDates.map((dateObj, index) => (
                          <div key={index}>
                            {new Date(dateObj.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                            {" - "}
                            {dateObj.availableSlots} slots
                            {index < tour.availableDates.length - 1 && <br />}
                          </div>
                        ))
                      ) : (
                        <span>No available dates</span>
                      )}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          tour.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {tour.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
