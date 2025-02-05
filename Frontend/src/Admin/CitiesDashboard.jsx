import  { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
function CitiesDashboard() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalCities: 0,
    totalTours: 0,
  });
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/city/`);
        const citiesWithTours = await Promise.all(
          response.data.cities.map(async (city) => {
       
            let toursCount = 0;
            try {
              const toursResponse = await axios.get(`${API_BASE_URL}/tours/city/${city._id}`);
              toursCount = toursResponse.data.length || 0;
            } catch (error) {
              console.error('Error fetching tours:', error);
            }

            return { ...city, toursCount };
          })
        );

      
        const totalCities = citiesWithTours.length;
        const totalTours = citiesWithTours.reduce((sum, city) => sum + city.toursCount, 0);

        setStatistics({
          totalCities,
          totalTours,
        });

        setCities(citiesWithTours); 
      } catch (error) {
        toast.error('Failed to fetch cities.');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

 
  const handleDeleteCity = async (cityId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this city!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/city/${cityId}`);
        toast.success(response.data.message);

     
        const updatedResponse = await axios.get(`${API_BASE_URL}/city/`);
        setCities(updatedResponse.data.cities);
      } catch (error) {
        console.error('Error deleting city:', error);
        toast.error(`Failed to delete city: ${error.response?.data?.message || error.message}`);
      }
    }
  };

 
  const handleEditCity = (city) => {
    navigate(`/admin/edit-city`, { state: { city } });
  };


  const handleAddCity = () => {
    navigate('/admin/add-city');
  };


  const barChartData = cities.map((city) => ({
    name: city.name,
    tours: city.toursCount,
  }));

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Cities Dashboard</h1>

   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Cities</h3>
          <p className="text-2xl">{statistics.totalCities}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Tours</h3>
          <p className="text-2xl">{statistics.totalTours}</p>
        </div>
      </div>

    
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tours per City</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tours" fill="#8884d8" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    
      <button
        onClick={handleAddCity}
        className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-600"
      >
        Add New City
      </button>

    
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">City ID</th>
              <th className="py-2 text-left">Image</th>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-left">Tours</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city._id} className="border-b hover:bg-gray-50">
                <td className="py-2">#{city._id}</td>
                <td className="py-2">
                  <img
                    src={`${API_BASE_URL}/uploads/${city.images?.[0]?.split('\\').pop()}`}
                    alt={city.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-2">{city.name}</td>
                <td className="py-2 w-[50%]">{city.description}</td>
                <td className="py-2">{city.toursCount}</td>
                <td className="py-2 space-x-2">
                  <button
                    onClick={() => handleEditCity(city)}
                    className="text-sm bg-sky-100 text-sky-600 px-2 py-1 rounded-md hover:bg-sky-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteCity(city._id)}
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

export default CitiesDashboard;