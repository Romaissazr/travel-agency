import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [feature, setFeature] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery/`, {
        params: {
          page,
          search: searchQuery,
          category,
          feature,
          sort,
        },
      });
      setImages(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page, searchQuery, category, feature, sort]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleFeatureChange = (e) => {
    setFeature(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Gallery</h1>

      <div className="mb-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          value={category}
          onChange={handleCategoryChange}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow sm:flex-grow-0"
        >
          <option value="">All Categories</option>
          <option value="Nature">Nature</option>
          <option value="Travel">Travel</option>
          <option value="Art">Art</option>
        </select>

        <select
          value={feature}
          onChange={handleFeatureChange}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow sm:flex-grow-0"
        >
          <option value="">All</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>

        <select
          value={sort}
          onChange={handleSortChange}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow sm:flex-grow-0"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={`${API_BASE_URL}/uploads/${image.images[0]}`}
                alt={image.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h2 className="font-bold text-lg">{image.title}</h2>
                <p className="text-sm text-gray-600">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`mx-1 my-1 px-3 py-1 border rounded-lg ${
              page === pageNum ? "bg-primary text-white" : "bg-white"
            } hover:bg-primary transition-colors duration-300`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;
