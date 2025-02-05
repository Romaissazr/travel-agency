import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/`);
        setCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to update this user's role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/users/${userId}/update-role`,
          {
            role: newRole,
          }
        );
        toast.success(response.data.message);

        const updatedResponse = await axios.get(`${API_BASE_URL}/users/`);
        setCustomers(updatedResponse.data.data);
      } catch (error) {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role.");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/users/${userId}`);
        toast.success(response.data.message);

        const updatedResponse = await axios.get(`${API_BASE_URL}/users/`);
        setCustomers(updatedResponse.data.data);
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Customers</h1>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Customer ID</th>
              <th className="py-2 text-left">Name</th>
              <th className="py-2 text-left hidden sm:table-cell">Email</th>
              <th className="py-2 text-left hidden sm:table-cell">Phone</th>
              <th className="py-2 text-left hidden sm:table-cell">Address</th>
              <th className="py-2 text-left">Role</th>
              <th className="py-2 text-left hidden sm:table-cell">Joined On</th>
              <th className="py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b hover:bg-gray-50">
                <td className="py-2">#{customer._id}</td>
                <td className="py-2">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="py-2 hidden sm:table-cell">{customer.email}</td>
                <td className="py-2 hidden sm:table-cell">
                  {customer.phone || "N/A"}
                </td>
                <td className="py-2 hidden sm:table-cell">
                  {customer.address || "N/A"}
                </td>
                <td className="py-2">{customer.role || "N/A"}</td>
                <td className="py-2 hidden sm:table-cell">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 space-x-2">
                  <select
                    value={customer.role}
                    onChange={(e) =>
                      handleUpdateRole(customer._id, e.target.value)
                    }
                    className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-200"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(customer._id)}
                    className="text-sm bg-rose-100 text-rose-600 px-2 py-1 rounded-md hover:bg-red-200"
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

export default Customers;
