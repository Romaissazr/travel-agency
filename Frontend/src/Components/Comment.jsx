import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function Comment({ tourId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? "text-yellow" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsResponse = await axios.get(
          `${API_BASE_URL}/reviews/${tourId}`
        );
       

        const reviewsWithFullUserDetails = await Promise.all(
          reviewsResponse.data.reviews.map(async (review) => {
            if (!review.user?._id) {
              console.warn("Skipping review with missing user ID:", review);
              return { ...review, user: null };
            }

            const userResponse = await axios.get(
              `${API_BASE_URL}/users/${review.user._id}`
            );
           

            return { ...review, user: userResponse.data };
          })
        );

        setReviews(reviewsWithFullUserDetails);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tourId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <img
                src={
                  review.user?.avatar
                    ? `${API_BASE_URL}${review.user.avatar}`
                    : "https://via.placeholder.com/60"
                }
                alt="Profile"
                className="w-12 h-12 sm:w-16 sm:h-16 border-4 object-cover border-white rounded-full drop-shadow-lg"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <h4 className="font-semibold">
                    {review.user?.firstName} {review.user?.lastName}
                  </h4>
                  <div className="flex items-center mt-2 sm:mt-0">
                    {renderStars(review.rating)}
                    <p className="ml-2 text-sm sm:text-base">
                      {review.rating || 0}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 4 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary hover:underline font-semibold"
          >
            {showAll ? "Show Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Comment;
