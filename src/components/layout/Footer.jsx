import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Scale,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-7 h-7 text-white" />
            <span className="text-xl font-bold text-white">
              LegalConnect
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            LegalConnect is a Nepal-focused platform that helps clients connect
            with verified lawyers, request appointments, negotiate fees, and
            manage legal consultations with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/home" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/lawyers" className="hover:text-white transition">
                Lawyers
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-white transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Areas */}
        <div>
          <h4 className="text-white font-semibold mb-4">Practice Areas</h4>
          <ul className="space-y-2 text-sm">
            <li>Corporate & Company Law</li>
            <li>Family & Divorce Law</li>
            <li>Criminal Defense</li>
            <li>Land & Property Law</li>
            <li>Labor & Employment Law</li>
            <li>Tax & Compliance</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
              <span>
                New Baneshwor, Kathmandu<br />
                Nepal
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>+977 9800000000</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>support@legalconnect.com</span>
            </li>
          </ul>

          {/* Social */}
          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-white transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} LegalConnect. All rights reserved.
          </p>
          <p>
            Built for Nepal 🇳🇵 | Connecting Clients & Lawyers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
