function TourHighlights({ icon: Icon, title, desc }) {
    return (
      <div className="">
        <div className="flex items-center gap-2 font-bold ">
          <Icon className="text-primary" />
          <p>{title}</p>
        </div>
        <p className="pl-6 mt-1 text-dark text-[14px] w-[260px]">{desc}</p>
      </div>
    );
  }
  
  export default TourHighlights;
  