import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8 max-w-full overflow-hidden">
        <Outlet/>
      </div>
    </div>
  );
};

export default AdminLayout;
