import React, { useEffect, useState } from "react";
import { getAdmins } from "../../api/adminApi";

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    (async () => setAdmins(await getAdmins()))();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admins</h1>

      <div className="grid gap-4">
        {admins.map((a) => (
          <div key={a.user_id} className="bg-white border rounded-xl p-4">
            <div className="font-semibold">{a.full_name}</div>
            <div className="text-sm text-gray-600">{a.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAdmins;
