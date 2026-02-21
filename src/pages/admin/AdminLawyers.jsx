import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getLawyersAdmin, verifyLawyer } from "../../api/adminApi";
import { API_SERVER } from "../../api/http";

/* ================= HELPERS ================= */

const toDocUrl = (p) => {
  if (!p) return "";
  const normalized = String(p).split("\\").join("/");
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `${API_SERVER}/${normalized.replace(/^\/+/, "")}`;
};

const isImage = (url) => {
  const u = String(url || "").toLowerCase();
  return (
    u.endsWith(".jpg") ||
    u.endsWith(".jpeg") ||
    u.endsWith(".png") ||
    u.endsWith(".webp") ||
    u.endsWith(".gif")
  );
};

const badgeClass = (ok) =>
  ok
    ? "bg-green-100 text-green-700 border border-green-200"
    : "bg-yellow-100 text-yellow-700 border border-yellow-200";

const formatMoney = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;

/* ================= COMPONENT ================= */

const AdminLawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal
  const [modalDoc, setModalDoc] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getLawyersAdmin();
      setLawyers(data || []);
    } catch (e) {
      setErr(e?.message || "Failed to load lawyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = lawyers.length;
    const verified = lawyers.filter((l) => Number(l.is_verified) === 1).length;
    return { total, verified, pending: total - verified };
  }, [lawyers]);

  if (loading) return <div className="p-6">Loading lawyers...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#142768]">Lawyers</h1>
          <p className="text-sm text-gray-600 mt-1">
            Review lawyer profiles, documents, and verification status.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-gray-100 border">
            Total: {stats.total}
          </span>
          <span className={`px-3 py-1 rounded-full ${badgeClass(true)}`}>
            Verified: {stats.verified}
          </span>
          <span className={`px-3 py-1 rounded-full ${badgeClass(false)}`}>
            Pending: {stats.pending}
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
              <th className="text-left px-6 py-3">Lawyer</th>
              <th className="text-left px-6 py-3">Specialization</th>
              <th className="text-left px-6 py-3">Experience</th>
              <th className="text-left px-6 py-3">Rate</th>
              <th className="text-left px-6 py-3">License</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-right px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {lawyers.map((l) => {
              const verified = Number(l.is_verified) === 1;
              const docUrl = toDocUrl(l.license_document);

              return (
                <tr key={l.user_id} className="hover:bg-gray-50 align-top">
                  {/* LAWYER */}
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/lawyers/${l.user_id}`}
                      className="font-semibold text-[#142768] hover:underline"
                    >
                      {l.full_name}
                    </Link>
                    <div className="text-xs text-gray-600">
                      {l.email} • {l.phone}
                    </div>
                  </td>

                  {/* SPECIALIZATION */}
                  <td className="px-6 py-4">{l.specialization || "—"}</td>

                  {/* EXPERIENCE */}
                  <td className="px-6 py-4">
                    {Number(l.experience_years || 0)} yrs
                  </td>

                  {/* RATE */}
                  <td className="px-6 py-4 font-semibold">
                    {formatMoney(l.hourly_rate)}
                  </td>

                  {/* PREVIEW */}
                  <td className="px-6 py-4">
                    {!docUrl ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <button
                        onClick={() => setModalDoc(docUrl)}
                        className="group"
                      >
                        {isImage(docUrl) ? (
                          <img
                            src={docUrl}
                            alt="preview"
                            className="w-20 h-14 object-cover rounded-lg border group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-20 h-14 flex items-center justify-center border rounded-lg bg-gray-50 text-xs text-gray-600">
                            View
                          </div>
                        )}
                      </button>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${badgeClass(
                        verified
                      )}`}
                    >
                      {verified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-right">
                    {!verified && (
                      <button
                        onClick={async () => {
                          await verifyLawyer(l.user_id);
                          load();
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:opacity-90"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!lawyers.length && (
          <div className="p-6 text-center text-gray-500">No lawyers found</div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {modalDoc && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full relative">
            <button
              onClick={() => setModalDoc(null)}
              className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 w-9 h-9 rounded-full flex items-center justify-center"
            >
              ✕
            </button>

            <div className="p-6">
              {isImage(modalDoc) ? (
                <img
                  src={modalDoc}
                  alt="Full Document"
                  className="max-h-[75vh] w-full object-contain"
                />
              ) : (
                <iframe
                  src={modalDoc}
                  title="Document"
                  className="w-full h-[75vh] border rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* DISCLAIMER */}
      <div className="text-xs text-gray-500">
        HireLawyer does not assume responsibility or liability for the accuracy,
        authenticity, or validity of any documents submitted or presented by
        lawyers on the platform.
      </div>
    </div>
  );
};

export default AdminLawyers;
