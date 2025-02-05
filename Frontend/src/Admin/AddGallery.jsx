import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AddGallery() {
  const navigate = useNavigate();
  const [gallery, setGallery] = useState({
    title: "",
    description: "",
    category: "",
    feature: false,
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGallery({ ...gallery, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setGallery((prevGallery) => ({
      ...prevGallery,
      images: [...prevGallery.images, ...files],
    }));
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...gallery.images];
    updatedImages.splice(index, 1);
    setGallery({ ...gallery, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (gallery.images.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", gallery.title);
    formData.append("description", gallery.description);
    formData.append("category", gallery.category);
    formData.append("feature", gallery.feature ? "true" : "false");

    gallery.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await toast.promise(
        axios.post(`${API_BASE_URL}/gallery/add`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          pending: "Uploading images...",
          success: "Gallery images uploaded successfully!",
          error: "Failed to upload images.",
        }
      );

      setTimeout(() => {
        navigate("/admin/gallery-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error adding images:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Gallery Images</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={gallery.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={gallery.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={gallery.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="feature"
              checked={gallery.feature}
              onChange={handleInputChange}
            />
            <span>Show on Home Page</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Images</label>
          <div className="flex space-x-2">
            {gallery.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Gallery Image ${index + 1}`}
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
          Upload Images
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

export default AddGallery;
