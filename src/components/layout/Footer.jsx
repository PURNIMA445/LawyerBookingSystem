import React from "react";
import { FaFacebook, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-12 pb-8 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
    
      {/* Logo */}
      <div className="flex items-start justify-center sm:justify-start">
        <Link to="/">
          <h1 className="text-2xl sm:text-3xl text-white font-semibold hover:text-indigo-500 transition duration-300">
            LEGALCONNECT
          </h1>
        </Link>
      </div>

      {/* Social Icons */}
      <div className="flex items-start justify-center sm:justify-start">
        <div>
          <h4 className="text-base mb-4 text-white">Follow Us</h4>
          <ul className="flex space-x-6 justify-center sm:justify-start">
            <li>
              <Link
                to="#"
                aria-label="Facebook"
                className="text-white hover:text-blue-500 text-2xl transition duration-300"
              >
                <FaFacebook />
              </Link>
            </li>
            
            <li>
              <Link
                to="#"
                aria-label="Instagram"
                className="text-white hover:text-yellow-400 text-2xl transition duration-300"
              >
                <FaInstagramSquare />
              </Link>
            </li>
            <li>
              <Link
                to="#"
                aria-label="LinkedIn"
                className="text-white hover:text-blue-500 text-2xl transition duration-300"
              >
                <FaLinkedin />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center sm:text-left">
        <h4 className="text-base mb-4 text-white">Contact Info</h4>
        <ul className="space-y-3">
          <li className="text-slate-400 text-sm leading-relaxed">
            4th Floor, Shree Pashupati Complex, New Road, Kathmandu, 44600
          </li>
          <li>
            <Link
              to="#"
              className="text-slate-400 hover:text-white text-sm transition duration-300"
            >
              info@law.com
            </Link>
          </li>
          <li className="text-slate-400 text-sm">
            Sunday to Friday: 10:00 AM - 6:00 PM
          </li>
        </ul>
      </div>

      {/* Information */}
      <div className="text-center sm:text-left">
        <h4 className="text-base mb-4 text-white">Information</h4>
        <ul className="space-y-3">
          <li>
            <Link
              to="/aboutus"
              className="text-slate-400 hover:text-white text-sm transition duration-300"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/terms"
              className="text-slate-400 hover:text-white text-sm transition duration-300"
            >
              Terms & Conditions
            </Link>
          </li>
          <li>
            <Link
              to="/privacy"
              className="text-slate-400 hover:text-white text-sm transition duration-300"
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              to="/docs"
              className="text-slate-400 hover:text-white text-sm transition duration-300"
            >
              Documentation
            </Link>
          </li>
        </ul>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="border-t border-gray-800 mt-10 pt-6">
      <p className="text-slate-400 text-1xl text-center font-bold">
        © 2025 LegalConnect. All rights reserved.
      </p>
    </div>
  </div>
</footer>

  );
};

export default Footer;