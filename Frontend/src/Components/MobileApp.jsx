import img from "../assets/Images/app.png";
import phone from "../assets/Images/phone.png";
import { FaApple } from "react-icons/fa6";
import { AiFillAndroid } from "react-icons/ai";

function MobileApp() {
  return (
    <div className="w-full h-[600px] md:h-[720px] my-10 md:my-20 flex flex-col md:flex-row justify-center items-center relative px-4 md:px-0">
      <img
        src={img}
        alt="City Background"
        className="object-cover h-full w-full absolute -z-10"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient backdrop-blur-[7.5px] -z-10"></div>
      <img src={phone} alt="" className="w-[200px] md:w-[350px]" />
      <div className="text-white flex flex-col gap-3 md:gap-5 text-center md:text-left">
        <h1 className="text-xl md:text-[36px] font-volkhov font-bold">
          Smart City Tour Mobile App
        </h1>
        <p className="text-[14px] md:text-[16px] font-extrabold">
          Available on IOS & Android
        </p>
        <p className="max-w-[300px] md:max-w-[505px] my-2 md:my-4">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
        <div className="flex flex-col md:flex-row gap-3 md:gap-5 justify-center">
          <button className="bg-secondary rounded-[40px] px-4 md:px-8 py-2 md:py-3 font-medium shadow-custom-yellow flex items-center gap-2">
            <FaApple className="text-[16px] md:text-[20px]" />
            <p>Download For IOS</p>
          </button>
          <button className="bg-secondary rounded-[40px] px-4 md:px-8 py-2 md:py-3 font-medium shadow-custom-yellow flex items-center gap-2">
            <AiFillAndroid className="text-[16px] md:text-[20px]" />
            <p>Download For Android</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileApp;
