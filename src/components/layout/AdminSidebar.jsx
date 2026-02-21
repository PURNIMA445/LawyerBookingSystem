import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
    isActive
      ? "bg-[#142768] text-white shadow"
      : "text-gray-700 hover:bg-gray-100"
  }`;

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col justify-between">
      
      {/* ===== TOP ===== */}
      <div className="p-6 space-y-6">
        
        {/* LOGO / BRAND */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#142768] flex items-center justify-center text-white font-bold text-lg">
            {/* Replace with <img src="/logo.png" /> if you have */}
            A
          </div>
          <div className="text-lg font-bold text-[#142768]">
            Admin Panel
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">
          <NavLink to="/" className={linkClass}>
            <span>🏠</span> Home
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <span>👥</span> Users
          </NavLink>

          <NavLink to="/admin/lawyers" className={linkClass}>
            <span>⚖️</span> Lawyers
          </NavLink>

          <NavLink to="/admin/appointments" className={linkClass}>
            <span>📅</span> Appointments
          </NavLink>

          <NavLink to="/admin/admins" className={linkClass}>
            <span>🛡️</span> Admins
          </NavLink>
        </nav>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="p-6 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 transition"
        >
          🔓 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
