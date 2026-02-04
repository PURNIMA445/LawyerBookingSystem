import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { myAppointments } from "../api/appointmentsApi";
import { isLoggedIn } from "../api/userApi";

const Dashboard = () => {
  const auth = useMemo(() => isLoggedIn(), []);
  const role = auth?.role;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await myAppointments();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    items.forEach(i => { if (c[i.status] !== undefined) c[i.status] += 1; });
    return c;
  }, [items]);

  const canManage = role === "lawyer" || role === "admin";

  const onStatus = async (appointmentId, status) => {
    // try {
    //   await updateAppointmentStatus(appointmentId, status);
    //   await load();
    // } catch (e) {
    //   setError(e.message || "Update failed");
    // }
  };

  if (!auth) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Please login to view your dashboard.</p>
        <Link to="/login" className="inline-block mt-6 bg-black text-white rounded-lg px-4 py-2">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Signed in as <span className="font-medium">{auth.full_name || auth.email}</span> ({role})</p>
        </div>
        <div className="flex gap-3">
          <Link to="/lawyers" className="border rounded-lg px-4 py-2 hover:bg-gray-50">Browse Lawyers</Link>
          {role === "client" && (
            <Link to="/bookappointment" className="bg-black text-white rounded-lg px-4 py-2 hover:opacity-90">Book Appointment</Link>
          )}
        </div>
      </div>

      {error && <div className="mt-6 text-red-600">{error}</div>}

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-gray-600 capitalize">{k}</div>
            <div className="text-2xl font-bold">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 border rounded-xl overflow-hidden bg-white">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Appointments</h2>
          <button onClick={load} className="text-sm underline">Refresh</button>
        </div>

        {loading ? (
          <div className="p-5 text-gray-600">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-5 text-gray-600">No appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-5 py-3">Date/Time</th>
                  <th className="text-left px-5 py-3">Client</th>
                  <th className="text-left px-5 py-3">Lawyer</th>
                  <th className="text-left px-5 py-3">Subject</th>
                  <th className="text-left px-5 py-3">Status</th>
                  {canManage && <th className="text-left px-5 py-3">Action</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.appointment_id} className="border-t">
                    <td className="px-5 py-3">
                      {new Date(a.appointment_datetime).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">{a.client_name}</td>
                    <td className="px-5 py-3">{a.lawyer_name}</td>
                    <td className="px-5 py-3">{a.subject || "-"}</td>
                    <td className="px-5 py-3 capitalize">{a.status}</td>
                    {canManage && (
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button className="border rounded px-2 py-1" onClick={() => onStatus(a.appointment_id, "confirmed")}>Confirm</button>
                          <button className="border rounded px-2 py-1" onClick={() => onStatus(a.appointment_id, "completed")}>Complete</button>
                          <button className="border rounded px-2 py-1" onClick={() => onStatus(a.appointment_id, "cancelled")}>Cancel</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
