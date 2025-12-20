import React from "react";
import { FaFacebook } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-12 pb-8 px-6 tracking-wide">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo */}
          <div className="flex items-center">
            <a href="#">
            <h1 className="text-3xl text-white font-p[cursive]">LEXAPPOINTMENT</h1>

            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center">
  <ul className="flex space-x-8">
    <li>
      <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-white text-3xl">
        <FaFacebook />
      </a>
    </li>

    <li>
      <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-white text-3xl">
        <FaLinkedin />
      </a>
    </li>

    <li>
      <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-white text-3xl">
        <FaSquareInstagram />
      </a>
    </li>
  </ul>
</div>


          {/* Useful Links */}
          <div>
            <h2 className="text-base mb-4 text-white">Contact info</h2>
            <ul className="space-y-3">
              <li className="text-slate-400 hover:text-white text-sm">4thFloor</li>
              <li className="text-slate-400 hover:text-white text-sm">info@law.com</li>
              <li className="text-slate-400 hover:text-white text-sm">Sunday To Friday:10:00AM-6:00AM</li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-base mb-4 text-white">Information</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white text-sm">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm">Terms & Conditions</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm">Documentation</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <p className="text-slate-400 text-sm mt-10 text-center">
          © 2025 LexAppointments. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
