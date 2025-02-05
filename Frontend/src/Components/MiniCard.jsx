function MiniCard({ img, text, colorClass }) {
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-3 px-3 py-2 shadow-lg ${colorClass} rounded-lg  sm:max-w-[250px]`}
    >
      {img}
      <p className="text-sm md:text-base">{text}</p>
    </div>
  );
}

export default MiniCard;
