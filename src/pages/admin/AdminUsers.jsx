import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers, verifyUser } from "../../api/adminApi";

const statusBadge = (verified) =>
  verified
    ? "bg-green-100 text-green-700 border border-green-200"
    : "bg-yellow-100 text-yellow-700 border border-yellow-200";

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getUsers(); // returns non-admin users (client + lawyer)
      setUsers(data || []);
    } catch (e) {
      setErr(e?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ show only clients
  const clients = useMemo(
    () => (users || []).filter((u) => u.role === "client"),
    [users]
  );

  const stats = useMemo(() => {
    const total = clients.length;
    const verified = clients.filter((c) => Boolean(c.is_verified)).length;
    const pending = total - verified;
    return { total, verified, pending };
  }, [clients]);

  if (loading) return <div className="p-6">Loading clients...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#142768]">Clients</h1>
          <p className="text-sm text-gray-600 mt-1">
            View registered clients, verify accounts, and open client profiles.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-700">
            Total: {stats.total}
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
            Verified: {stats.verified}
          </span>
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            Pending: {stats.pending}
          </span>
        </div>
      </div>

      {err ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {err}
        </div>
      ) : null}

      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-6 py-3">Client</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Phone</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Registered</th>
              <th className="text-right px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {clients.map((u) => {
              const verified = Boolean(u.is_verified);

              return (
                <tr key={u.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/clients/${u.user_id}`}
                      className="font-semibold text-gray-900 hover:underline"
                      title="View client profile"
                    >
                      {u.full_name}
                    </Link>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Client ID: {u.user_id}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-700">{u.email}</td>

                  <td className="px-6 py-4 text-gray-700">{u.phone || "—"}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusBadge(
                        verified
                      )}`}
                    >
                      {verified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {u.created_at ? formatDate(u.created_at) : "—"}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/admin/clients/${u.user_id}`}
                      className="inline-flex items-center px-4 py-2 border border-[#142768] text-[#142768] rounded-lg hover:bg-blue-50 transition"
                    >
                      View Profile
                    </Link>

                    {!verified ? (
                      <button
                        onClick={async () => {
                          await verifyUser(u.user_id);
                          load();
                        }}
                        className="inline-flex items-center px-4 py-2 bg-[#142768] text-white rounded-lg hover:opacity-90 transition"
                      >
                        Verify
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!clients.length ? (
          <div className="p-6 text-gray-500 text-center">No clients found</div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminUsers;
