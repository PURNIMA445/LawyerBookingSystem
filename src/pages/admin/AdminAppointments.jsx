import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointmentsAdmin, cancelAppointment } from "../../api/adminApi";

/* ================= HELPERS ================= */

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (t) => {
  if (!t) return "—";
  const s = String(t);
  // MySQL TIME often "HH:MM:SS" -> show "HH:MM"
  return s.length >= 5 ? s.slice(0, 5) : s;
};

const statusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (["approved", "confirmed", "completed", "paid", "active"].includes(s))
    return "bg-green-100 text-green-700 border border-green-200";
  if (["pending", "negotiating", "scheduled"].includes(s))
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  if (["cancelled", "rejected"].includes(s))
    return "bg-red-100 text-red-700 border border-red-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
};

/* ================= COMPONENT ================= */

const AdminAppointments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await getAppointmentsAdmin();
      setItems(Array.isArray(res) ? res : []);
    } catch (e) {
      setErr(e?.message || "Failed to load appointments");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => items || [], [items]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Appointments</h1>

        <button
          onClick={load}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition"
        >
          Refresh
        </button>
      </div>

      {err ? <div className="text-sm text-red-600">{err}</div> : null}
      {loading ? <div className="text-sm text-gray-600">Loading…</div> : null}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Lawyer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((a) => {
                console.log(a)
                const clientId =
                  a.client_id || a.client_user_id || a.clientId || a.user_id || null;
                const lawyerId =
                  a.lawyer_id || a.lawyer_user_id || a.lawyerId || null;

                return (
                  <tr key={a.appointment_id} className="border-t">
                    <td className="p-3 font-medium text-gray-900">
                      {a.subject || "—"}
                    </td>

                    <td className="p-3">
                      {clientId ? (
                        <Link
                          to={`/admin/clients/${clientId}`}
                          className="text-[#142768] hover:underline"
                          title="View client"
                        >
                          {a.client_name || "Client"}
                        </Link>
                      ) : (
                        <span className="text-gray-700">
                          {a.client_name || "—"}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      {lawyerId ? (
                        <Link
                          to={`/admin/lawyers/${lawyerId}`}
                          className="text-[#142768] hover:underline"
                          title="View lawyer"
                        >
                          {a.lawyer_name || "Lawyer"}
                        </Link>
                      ) : (
                        <span className="text-gray-700">
                          {a.lawyer_name || "—"}
                        </span>
                      )}
                    </td>

                    <td className="p-3">{formatDate(a.appointment_date)}</td>
                    <td className="p-3">{formatTime(a.appointment_time)}</td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full border text-xs ${statusBadge(
                          a.status
                        )}`}
                      >
                        {a.status || "—"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/appointments/${a.appointment_id}`}
                          className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50 transition text-[#142768]"
                          title="View appointment details"
                        >
                          View
                        </Link>

                        {String(a.status || "").toLowerCase() !== "cancelled" ? (
                          <button
                            onClick={async () => {
                              await cancelAppointment(a.appointment_id);
                              load();
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:opacity-95"
                            title="Cancel appointment"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 px-2">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && !rows.length ? (
                <tr>
                  <td className="p-6 text-gray-500" colSpan={7}>
                    No appointments found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Tip: Click a client or lawyer name to open their profile.
      </p>
    </div>
  );
};

export default AdminAppointments;