import React, { useEffect, useMemo, useState } from "react";
import { getAdmins } from "../../api/adminApi";

/* ================= COMPONENT ================= */

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getAdmins();
      setAdmins(data || []);
    } catch (e) {
      setErr(e?.message || "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    return {
      total: admins.length
    };
  }, [admins]);

  if (loading) return <div className="p-6">Loading admins...</div>;

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#142768]">Admins</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system administrators and access roles.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-gray-100 border">
            Total: {stats.total}
          </span>
        </div>
      </div>

      {err && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {err}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Admin</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Phone</th>
              <th className="text-left px-6 py-3">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {admins.map((a) => (
              <tr key={a.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-[#142768]">
                  {a.full_name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.email}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {a.phone || "—"}
                </td>

                <td className="px-6 py-4 text-gray-500 text-xs">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!admins.length && (
          <div className="p-6 text-center text-gray-500">
            No admins found
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500">
        Only authorized personnel should have administrative access.
      </div>
    </div>
  );
};

export default AdminAdmins;