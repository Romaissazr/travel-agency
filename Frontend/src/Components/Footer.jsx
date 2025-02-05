
import img1 from "../assets/Images/mastercard.png";
import img2 from "../assets/Images/bitpay.png";
import img3 from "../assets/Images/visa.png";
import img4 from "../assets/Images/express.png";
import img5 from "../assets/Images/discover.png";
import img6 from "../assets/Images/sofort.png";
import img7 from "../assets/Images/google.png";
import img8 from "../assets/Images/apple.png";
import img9 from "../assets/Images/paypal.png";
import img10 from "../assets/Images/maestro.png";

import fb from "../assets/Images/fb.svg";
import tw from "../assets/Images/tw.svg";
import ig from "../assets/Images/inst.svg";
import pint from "../assets/Images/pint.svg";

function Footer() {
  return (
    <div className="bg-darkBlue text-white">
      <div className="flex flex-col md:flex-row items-start justify-around pt-8 pb-14 px-4 md:px-20 space-y-6 md:space-y-0">
        <div className="flex justify-between w-full md:w-auto md:gap-48 ">
          <div>
            <p className="text-lg font-semibold mb-4">Company</p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Press Room
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold mb-4">Help</p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-lg font-semibold">Payment Methods</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            <img src={img1} alt="Mastercard" className="w-[40px] h-[26px]" />
            <img src={img2} alt="BitPay" className="w-[40px] h-[26px]" />
            <img src={img3} alt="Visa" className="w-[40px] h-[26px]" />
            <img src={img4} alt="Express" className="w-[40px] h-[26px]" />
            <img src={img5} alt="Discover" className="w-[40px] h-[26px]" />
            <img src={img6} alt="Sofort" className="w-[40px] h-[26px]" />
            <img src={img7} alt="Google Pay" className="w-[40px] h-[26px]" />
            <img src={img8} alt="Apple Pay" className="w-[40px] h-[26px]" />
            <img src={img9} alt="PayPal" className="w-[40px] h-[26px]" />
            <img src={img10} alt="Maestro" className="w-[40px] h-[26px]" />
          </div>
          <div className="">
            <p className="text-lg font-semibold mt-4">Company</p>
            <p className="text-gray-300">Become a Tour Guide for Us</p>
          </div>
        </div>
      </div>
      <div className="bg-black flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-4 bg-opacity-20 w-full">
        <p className="text-gray-400 text-center md:text-left">
          Copyright 2025 Tour Guide. All Rights Reserved
        </p>
        <div className="flex gap-2 mt-4 md:mt-0">
          <img src={fb} alt="" />
          <img src={tw} alt="" />
          <img src={ig} alt="" />
          <img src={pint} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
