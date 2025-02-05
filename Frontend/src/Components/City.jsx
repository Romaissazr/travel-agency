function City({ city, onClick, className }) {
  return (
    <div
      className={`py-[5px] px-[16px] md:px-[32px]  border border-primary rounded-[30px] cursor-pointer ${className}`}
      onClick={onClick}
    >
      {city}
    </div>
  );
}

export default City;
