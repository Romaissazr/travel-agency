import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete, MdChangeCircle } from "react-icons/md";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function EditTour() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedTour = location.state?.tour;

  const isPassedTourObject =
    typeof passedTour === "object" && passedTour !== null;
  const tourId = isPassedTourObject ? passedTour._id : passedTour;

  const [tour, setTour] = useState(
    isPassedTourObject
      ? { ...passedTour, city: passedTour.city || { _id: "", name: "" } }
      : {
          title: "",
          city: { _id: "", name: "" },
          address: "",
          distance: "",
          duration: "",
          description: "",
          price: "",
          maxGroupSize: "",
          availableDates: [],
          time: "10:00 AM",
          activity: [],
          included: [],
          notIncluded: [],
          safety: "",
          language: [],
          meetingPoint: {
            address: "",
            coordinates: {
              latitude: 0,
              longitude: 0,
            },
          },
          images: [],
          status: "active",
          availableSlots: 0,
          featured: false,
          rating: 0,
          reviews: [],
        }
  );
  const [newAvailableDate, setNewAvailableDate] = useState("");
  const [newAvailableSlots, setNewAvailableSlots] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/city/`);
        if (response.data && Array.isArray(response.data.cities)) {
          setCities(response.data.cities);
        } else {
          toast.error("Unexpected cities response structure");
          setCities([]);
        }
      } catch (error) {
        toast.error(
          `Failed to fetch cities: ${
            error.response?.data?.message || error.message
          }`
        );
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        if (!tourId) {
          toast.error("Tour ID is missing. Please check the navigation state.");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/tours/${tourId}`);
        const fetchedTour = response.data.data;
        setTour(fetchedTour);
      } catch (error) {
        toast.error(`Failed to fetch tour details: ${error.message}`);
      }
    };

    if (!isPassedTourObject) {
      fetchTour();
    }
  }, [isPassedTourObject, tourId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTour({ ...tour, [name]: value });
  };

  const handleNestedInputChange = (
    e,
    parentField,
    nestedField,
    deeplyNestedField = null
  ) => {
    const { value } = e.target;
    setTour((prevTour) => {
      if (deeplyNestedField) {
        return {
          ...prevTour,
          [parentField]: {
            ...prevTour[parentField],
            [nestedField]: {
              ...prevTour[parentField][nestedField],
              [deeplyNestedField]: value,
            },
          },
        };
      } else {
        return {
          ...prevTour,
          [parentField]: {
            ...prevTour[parentField],
            [nestedField]: value,
          },
        };
      }
    });
  };

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find((city) => city._id === selectedCityId);
    setTour({ ...tour, city: selectedCity || { _id: "", name: "" } });
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...tour.images];
    updatedImages.splice(index, 1);
    setTour({ ...tour, images: updatedImages });
  };

  const handleReplaceImage = (index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const updatedImages = [...tour.images];
        updatedImages[index] = file;
        setTour({ ...tour, images: updatedImages });
      }
    };
    fileInput.click();
  };

  const handleAddAvailableDate = () => {
    if (!newAvailableDate || !newAvailableSlots) {
      toast.error("Please provide both a date and available slots.");
      return;
    }

    if (
      tour.availableDates.some((dateObj) => dateObj.date === newAvailableDate)
    ) {
      toast.error("This date already exists.");
      return;
    }

    setTour((prevTour) => ({
      ...prevTour,
      availableDates: [
        ...prevTour.availableDates,
        {
          date: newAvailableDate,
          availableSlots: parseInt(newAvailableSlots, 10),
        },
      ],
    }));
    setNewAvailableDate("");
    setNewAvailableSlots("");
  };

  const handleRemoveAvailableDate = (index) => {
    setTour((prevTour) => ({
      ...prevTour,
      availableDates: prevTour.availableDates.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!tour.city || !tour.city._id) {
        throw new Error("City is required.");
      }

      const formData = new FormData();
      Object.keys(tour).forEach((key) => {
        if (key === "images") return;
        if (key === "city") {
          formData.append("city", tour.city._id);
        } else if (key === "availableDates") {
          formData.append(
            "availableDates",
            JSON.stringify(tour.availableDates)
          );
        } else if (Array.isArray(tour[key])) {
          formData.append(key, JSON.stringify(tour[key]));
        } else if (typeof tour[key] === "object") {
          formData.append(key, JSON.stringify(tour[key]));
        } else {
          formData.append(key, tour[key]);
        }
      });

      const existingImages = tour.images.filter(
        (image) => typeof image === "string"
      );
      if (existingImages.length > 0) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }
      const newImages = tour.images.filter((image) => image instanceof File);
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      await toast.promise(
        axios.put(`${API_BASE_URL}/tours/${tourId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        {
          pending: "Updating tour...",
          success: "Tour updated successfully!",
          error: "Failed to update tour.",
        }
      );

      navigate("/admin/tours");
    } catch (error) {
      console.error("Error updating tour:", error);
      toast.error(
        error.message || "An error occurred while updating the tour."
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Tour</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={tour.title || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <select
            name="city"
            value={tour.city?._id || ""}
            onChange={handleCityChange}
            className="w-full p-2 border rounded"
            required
          >
            {tour.city?._id && (
              <option value={tour.city._id}>{tour.city.name}</option>
            )}
            {cities
              .filter((city) => city._id !== tour.city?._id)
              .map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={tour.address || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Distance</label>
            <input
              type="number"
              name="distance"
              value={tour.distance || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Duration</label>
            <input
              type="number"
              name="duration"
              value={tour.duration || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={tour.description || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={tour.price || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Max Group Size</label>
            <input
              type="number"
              name="maxGroupSize"
              value={tour.maxGroupSize || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Available Dates</label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={newAvailableDate}
              onChange={(e) => setNewAvailableDate(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="number"
              value={newAvailableSlots}
              onChange={(e) => setNewAvailableSlots(e.target.value)}
              placeholder="Slots"
              className="p-2 border rounded w-24"
            />
            <button
              type="button"
              onClick={handleAddAvailableDate}
              className="bg-primary text-white px-3 py-1 rounded "
            >
              Add
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {tour.availableDates.map((dateObj, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>
                  {new Date(dateObj.date).toLocaleDateString()} -{" "}
                  {dateObj.availableSlots} slots
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveAvailableDate(index)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Time</label>
          <input
            type="time"
            name="time"
            value={tour.time || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Activity</label>
          <input
            type="text"
            name="activity"
            value={tour.activity.join(", ") || ""}
            onChange={(e) => {
              const activities = e.target.value.split(",").map((a) => a.trim());
              setTour({ ...tour, activity: activities });
            }}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Included</label>
            <input
              type="text"
              name="included"
              value={tour.included.join(", ") || ""}
              onChange={(e) => {
                const included = e.target.value.split(",").map((i) => i.trim());
                setTour({ ...tour, included: included });
              }}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Not Included</label>
            <input
              type="text"
              name="notIncluded"
              value={tour.notIncluded.join(", ") || ""}
              onChange={(e) => {
                const notIncluded = e.target.value
                  .split(",")
                  .map((n) => n.trim());
                setTour({ ...tour, notIncluded: notIncluded });
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Safety</label>
          <input
            type="text"
            name="safety"
            value={tour.safety || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Language</label>
          <input
            type="text"
            name="language"
            value={tour.language.join(", ") || ""}
            onChange={(e) => {
              const languages = e.target.value.split(",").map((l) => l.trim());
              setTour({ ...tour, language: languages });
            }}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Meeting Point Address
          </label>
          <input
            type="text"
            name="meetingPointAddress"
            value={tour.meetingPoint.address || ""}
            onChange={(e) =>
              handleNestedInputChange(e, "meetingPoint", "address")
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              type="number"
              name="meetingPointLatitude"
              value={tour.meetingPoint.coordinates.latitude || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  e,
                  "meetingPoint",
                  "coordinates",
                  "latitude"
                )
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              type="number"
              name="meetingPointLongitude"
              value={tour.meetingPoint.coordinates.longitude || ""}
              onChange={(e) =>
                handleNestedInputChange(
                  e,
                  "meetingPoint",
                  "coordinates",
                  "longitude"
                )
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={tour.status || "active"}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="active">Active</option>
              <option value="fully booked">Fully Booked</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Featured</label>
          <div className="flex items-center">
            <div
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                tour.featured ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setTour({ ...tour, featured: !tour.featured })}
            >
              <div
                className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  tour.featured ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm text-gray-700">
              {tour.featured ? "Featured" : "Not Featured"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Images</label>
          <div className="flex space-x-2">
            {tour.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={
                    typeof image === "string"
                      ? `${API_BASE_URL}/uploads/${image}`
                      : URL.createObjectURL(image)
                  }
                  alt={`Tour Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <MdDelete size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleReplaceImage(index)}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 text-xs"
                >
                  <MdChangeCircle size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => document.getElementById("add-image-input").click()}
              className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-500 hover:border-gray-700"
            >
              +
            </button>

            <input
              id="add-image-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setTour({ ...tour, images: [...tour.images, file] });
                }
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md "
        >
          Update Tour
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

export default EditTour;
