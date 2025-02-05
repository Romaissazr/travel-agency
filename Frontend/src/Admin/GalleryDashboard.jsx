import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function GalleryDashboard() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/gallery/`);
        setImages(response.data.data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        toast.error("Failed to load images.");
      }
    };

    fetchGalleryImages();
  }, []);

  const deleteImage = async (imageId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This image will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/gallery/${imageId}`);
        setImages(images.filter((image) => image._id !== imageId));
        toast.success("Image deleted successfully!");
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete image.");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gallery Dashboard</h2>

      <button
        onClick={() => navigate("/admin/add-gallery")}
        className="bg-primary text-white px-4 py-2 rounded-md mb-6 "
      >
        Add New Image
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image._id}
            className="relative group border rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={`${API_BASE_URL}/uploads/${image.images[0]}`}
              alt={image.title}
              className="w-full h-[500px] object-cover transition-transform transform group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="text-white font-semibold">{image.title}</h3>
              <p className="text-white text-sm">{image.category}</p>
              <div className="flex space-x-3 mt-2">
                <Link
                  to="/admin/edit-gallery"
                  state={{ imageData: image }}
                  className="bg-white text-sky-600 px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-gray-200"
                >
                  <FaEdit /> <span>Edit</span>
                </Link>
                <button
                  onClick={() => deleteImage(image._id)}
                  className="bg-white text-rose-600 px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-gray-200"
                >
                  <FaTrash /> <span>Delete</span>
                </button>
              </div>
            </div>

            {image.feature && (
              <span className="absolute top-2 left-2 bg-yellow-400 text-xl font-bold px-2 py-1 rounded-md text-white">
                Featured
              </span>
            )}
          </div>
        ))}
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

export default GalleryDashboard;
