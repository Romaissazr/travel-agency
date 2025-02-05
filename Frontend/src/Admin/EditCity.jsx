import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function EditCity() {
  const navigate = useNavigate();
  const location = useLocation();
  const cityData = location.state?.city;

  const [city, setCity] = useState({
    name: cityData?.name || "",
    description: cityData?.description || "",
    images: cityData?.images || [],
  });

  const [newImages, setNewImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCity({ ...city, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const invalidFiles = files.filter(
      (file) => !validImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Only image files (JPEG, PNG, GIF, WEBP) are allowed.");
      return;
    }

    setNewImages((prevImages) => [...prevImages, ...files]);
  };

  const handleDeleteImage = (index, isNewImage) => {
    if (isNewImage) {
      const updatedImages = [...newImages];
      updatedImages.splice(index, 1);
      setNewImages(updatedImages);
    } else {
      const updatedImages = [...city.images];
      updatedImages.splice(index, 1);
      setCity({ ...city, images: updatedImages });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", city.name);
      formData.append("description", city.description);

      city.images.forEach((image) => {
        formData.append("existingImages", image);
      });

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      await toast.promise(
        axios.put(`${API_BASE_URL}/city/${cityData._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          pending: "Updating city...",
          success: "City updated successfully!",
          error: "Failed to update city.",
        }
      );

      setTimeout(() => {
        navigate("/admin/cities");
      }, 2000);
    } catch (error) {
      console.error("Error updating city:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit City</h1>

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
          <label className="block text-sm font-medium">Existing Images</label>
          <div className="flex space-x-2">
            {city.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={`${API_BASE_URL}/uploads/${image.split("\\").pop()}`}
                  alt={`City Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index, false)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">New Images</label>
          <div className="flex space-x-2">
            {newImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New City Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index, true)}
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
          Update City
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

export default EditCity;
