import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function EditGallery() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageData } = location.state || {};

  const [formData, setFormData] = useState({
    title: imageData?.title || "",
    description: imageData?.description || "",
    category: imageData?.category || "",
    feature: imageData?.feature || false,
    existingImages: imageData?.images || [],
  });

  const [newImages, setNewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const handleDeleteImage = (index, isNew) => {
    if (isNew) {
      setNewImages(newImages.filter((_, i) => i !== index));
    } else {
      setFormData({
        ...formData,
        existingImages: formData.existingImages.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("feature", formData.feature ? "true" : "false");
    data.append("existingImages", formData.existingImages.join(",")); // Convert array to comma-separated string

    newImages.forEach((image) => {
      data.append("images", image);
    });

    try {
      await toast.promise(
        axios.patch(`${API_BASE_URL}/gallery/${imageData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        {
          pending: "Updating gallery...",
          success: "Gallery updated successfully!",
          error: "Failed to update gallery.",
        }
      );

      setTimeout(() => {
        navigate("/admin/gallery-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Gallery Image</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="feature"
              checked={formData.feature}
              onChange={handleChange}
            />
            <span>Show on Home Page</span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Existing Images</label>
          <div className="flex flex-wrap gap-2">
            {formData.existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={`${API_BASE_URL}/uploads/${image}`}
                  alt={`Gallery Image ${index + 1}`}
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
          <div className="flex flex-wrap gap-2">
            {newImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New Gallery Image ${index + 1}`}
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
              onChange={handleImageChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md "
        >
          Update Gallery
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

export default EditGallery;
