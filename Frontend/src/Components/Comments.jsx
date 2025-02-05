import { FaStar } from "react-icons/fa";

import Comment from "./Comment";

function Comments({ rating, reviews, tourId }) {
  const items = [
    { text: "Guide", value: 4.8 },
    { text: "Transportation", value: 3 },
    { text: "Value for money", value: 4.5 },
    { text: "Safety", value: 4.0 },
  ];

  const formattedRating = parseFloat(rating).toFixed(1);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={
            i <= rating
              ? "text-yellow text-[20px] sm:text-[30px] lg:text-[40px]"
              : "text-[#CFD9DE] text-[20px] sm:text-[30px] lg:text-[40px]"
          }
        />
      );
    }
    return stars;
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-6 sm:py-10">
      <div className="py-6 sm:py-10">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-volkhov font-bold my-4">
          Customer Review
        </h1>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black">
                {formattedRating}
              </p>
              <p className="text-sm sm:text-base lg:text-lg font-light pt-2 sm:pt-3 text-dark">
                {reviews} reviews
              </p>
            </div>
            <div className="flex gap-1 mt-3 sm:mt-4">{renderStars()}</div>
          </div>
        </div>
      </div>

      <Comment tourId={tourId} />
    </div>
  );
}

export default Comments;
