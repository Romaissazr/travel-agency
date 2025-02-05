function Button({ text, onClick }) {
  return (
    <button
      className="bg-secondary hover:bg-secondary-dark rounded-[15px] text-white px-8 font-semibold py-3 shadow-md transition-all transform hover:scale-105 w-full md:w-auto"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
