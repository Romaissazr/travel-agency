import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
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
function ToursDashboard() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalTours: 0,
    totalBookings: 0,
    activeTours: 0,
    fullyBookedTours: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tours/`);
        const toursWithCityAndBookings = await Promise.all(
          response.data.data.map(async (tour) => {
            let cityData = { name: "N/A" };
            if (tour.city) {
              try {
                const cityResponse = await axios.get(
                  `${API_BASE_URL}/city/${tour.city}`
                );
                cityData = cityResponse.data.city || { name: "N/A" };
              } catch (error) {
                console.error("Error fetching city details:", error);
              }
            }

            let confirmedBookingsCount = 0;
            try {
              const bookingsResponse = await axios.get(
                `${API_BASE_URL}/bookings/tour/${tour._id}`
              );
              // Filter bookings to only include confirmed ones
              confirmedBookingsCount =
                bookingsResponse.data.bookings?.filter(
                  (booking) => booking.status === "confirmed"
                ).length || 0;
            } catch (error) {
              console.error("Error fetching bookings:", error);
            }

            return { ...tour, city: cityData, confirmedBookingsCount };
          })
        );

        const totalTours = toursWithCityAndBookings.length;
        const totalBookings = toursWithCityAndBookings.reduce(
          (sum, tour) => sum + tour.confirmedBookingsCount,
          0
        );
        const activeTours = toursWithCityAndBookings.filter(
          (tour) => tour.status === "active"
        ).length;
        const fullyBookedTours = toursWithCityAndBookings.filter(
          (tour) => tour.status === "fully booked"
        ).length;

        setStatistics({
          totalTours,
          totalBookings,
          activeTours,
          fullyBookedTours,
        });

        setTours(toursWithCityAndBookings);
      } catch (error) {
        toast.error("Failed to fetch tours.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleDeleteTour = async (tourId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this tour!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/tours/${tourId}`);
        toast.success(response.data.message);

        const updatedResponse = await axios.get(`${API_BASE_URL}/tours/`);
        setTours(updatedResponse.data.data);
      } catch (error) {
        console.error("Error deleting tour:", error);
        toast.error(
          `Failed to delete tour: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const handleEditTour = (tour) => {
    navigate(`/admin/edit-tour`, { state: { tour } });
  };

  const handleAddTour = () => {
    navigate("/admin/add-tour");
  };

  const barChartData = [
    { name: "Total Tours", value: statistics.totalTours },
    { name: "Total Bookings", value: statistics.totalBookings },
    { name: "Active Tours", value: statistics.activeTours },
    { name: "Fully Booked Tours", value: statistics.fullyBookedTours },
  ];

  const pieChartData = [
    { name: "Active Tours", value: statistics.activeTours },
    { name: "Fully Booked Tours", value: statistics.fullyBookedTours },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tours Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Tours</h3>
          <p className="text-2xl">{statistics.totalTours}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Bookings</h3>
          <p className="text-2xl">{statistics.totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Active Tours</h3>
          <p className="text-2xl">{statistics.activeTours}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Fully Booked Tours</h3>
          <p className="text-2xl">{statistics.fullyBookedTours}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Tour Statistics</h3>
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

      <button
        onClick={handleAddTour}
        className="bg-primary text-white px-4 py-2 rounded-md mb-6 "
      >
        Add New Tour
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Tour ID</th>
              <th className="py-2 text-left">Image</th>
              <th className="py-2 text-left">Title</th>
              <th className="py-2 text-left">City</th>
              <th className="py-2 text-left">Price</th>
              <th className="py-2 text-left">Duration</th>
              <th className="py-2 text-left">Dates</th>
              <th className="py-2 text-left">Bookings</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id} className="border-b hover:bg-gray-50">
                <td className="py-2">#{tour._id}</td>
                <td className="py-2">
                  <img
                    src={`${API_BASE_URL}/uploads/${tour.images?.[0]
                      ?.split("\\")
                      .pop()}`}
                    alt={tour.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2">{tour.title}</td>
                <td className="py-2">{tour.city?.name || "N/A"}</td>
                <td className="py-2">${tour.price}</td>
                <td className="py-2">{tour.duration} hours</td>
                <td className="py-2">
                  {tour.availableDates && tour.availableDates.length > 0 ? (
                    tour.availableDates.map((dateObj, index) => (
                      <div key={index}>
                        {new Date(dateObj.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        {" - "}
                        {dateObj.availableSlots} slots
                        {index < tour.availableDates.length - 1 && <br />}
                      </div>
                    ))
                  ) : (
                    <span>No available dates</span>
                  )}
                </td>
                <td className="py-2">{tour.confirmedBookingsCount}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${
                      tour.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {tour.status}
                  </span>
                </td>
                <td className="py-2 space-x-2">
                  <button
                    onClick={() => handleEditTour(tour._id)}
                    className="text-sm bg-sky-100 text-sky-600 px-2 py-1 rounded-md hover:bg-sky-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteTour(tour._id)}
                    className="text-sm bg-rose-100 text-rose-600 px-2 py-1 rounded-md hover:bg-rose-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default ToursDashboard;
