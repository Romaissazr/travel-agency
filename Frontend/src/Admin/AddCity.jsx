import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function AddCity() {
  const navigate = useNavigate();
  const [city, setCity] = useState({
    name: "",
    description: "",
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCity({ ...city, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setCity((prevCity) => ({
      ...prevCity,
      images: [...prevCity.images, ...files],
    }));
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...city.images];
    updatedImages.splice(index, 1);
    setCity({ ...city, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", city.name);
      formData.append("description", city.description);
      city.images.forEach((image) => {
        formData.append("images", image);
      });

      await toast.promise(
        axios.post(`${API_BASE_URL}/city/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          pending: "Adding city...",
          success: "City added successfully!",
          error: "Failed to add city.",
        }
      );

      setTimeout(() => {
        navigate("/admin/cities");
      }, 2000);
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New City</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={city.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={city.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Images</label>
          <div className="flex space-x-2">
            {city.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`City Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => document.getElementById("image-upload").click()}
              className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-500 hover:border-gray-700"
            >
              +
            </button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add City
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
  );
}

export default AddCity;
