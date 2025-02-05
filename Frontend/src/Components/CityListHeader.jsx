function CityListHeader({ city, count, sortBy, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row mx-4 sm:mx-10 lg:mx-20 justify-between items-center py-5 border-b border-gray-200">
      <div className="text-center sm:text-left mb-4 sm:mb-0">
        <h1 className="text-xl sm:text-2xl font-bold font-volkhov text-dark">
          Things To Do in {city}
        </h1>
        <p className="text-gray-600">{count} Activities Found</p>
      </div>

      <div className="flex items-center">
        <p className="text-gray-600 font-medium mr-3">Sort by:</p>
        <select
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="popularity">Popularity</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
}

export default CityListHeader;
