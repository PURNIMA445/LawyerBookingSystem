import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { verifyUser } from "../../api/adminApi";
import { API_SERVER } from "../../api/http";
import {
  getClientAppointments,
  getClientBilling,
  getClientCases,
  getClientDocuments,
  getClientProfile,
} from "../../api/clientApi";

/* ================= HELPERS ================= */

const toFileUrl = (p) => {
  if (!p) return "";
  const normalized = String(p).split("\\").join("/");
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `${API_SERVER}/${normalized.replace(/^\/+/, "")}`;
};

const isImage = (url) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url || "");

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatMoney = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;

const statusPill = (ok) =>
  ok
    ? "bg-green-100 text-green-700 border border-green-200"
    : "bg-yellow-100 text-yellow-700 border border-yellow-200";

const badge = (status) => {
  const s = String(status || "").toLowerCase();
  if (["active", "approved", "confirmed", "paid", "completed"].includes(s))
    return "bg-green-100 text-green-700 border border-green-200";
  if (["pending", "negotiating", "scheduled"].includes(s))
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  if (["cancelled", "rejected", "unpaid"].includes(s))
    return "bg-red-100 text-red-700 border border-red-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
};

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Client"
  )}&size=200&background=142768&color=fff`;

/* ================= PAGE ================= */

const AdminClientProfile = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    client: null,
    cases: [],
    appointments: [],
    documents: [],
    billing: [],
    stats: {},
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [docModal, setDocModal] = useState(null);

  const computeStats = (cases, appointments, documents) => {
    const totalCases = cases.length;
    const activeCases = cases.filter(
      (c) => String(c.status || "").toLowerCase() === "active"
    ).length;

    const upcomingAppointments = appointments.filter((a) =>
      ["pending", "negotiating", "approved"].includes(
        String(a.status || "").toLowerCase()
      )
    ).length;

    const totalDocs = documents.length;

    return { totalCases, activeCases, upcomingAppointments, totalDocs };
  };

  const loadAll = async () => {
    setLoading(true);
    setErr("");

    try {
      const [client, cases, appointments, documents, billing] =
        await Promise.all([
          getClientProfile(clientId),
          getClientCases(clientId),
          getClientAppointments(clientId),
          getClientDocuments(clientId),
          getClientBilling(clientId),
        ]);

      setData({
        client: client || null,
        cases: cases || [],
        appointments: appointments || [],
        documents: documents || [],
        billing: billing || [],
        stats: computeStats(cases || [], appointments || [], documents || []),
      });
    } catch (e) {
      setErr(e?.message || "Failed to load client profile bundle");
      setData({
        client: null,
        cases: [],
        appointments: [],
        documents: [],
        billing: [],
        stats: {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const client = data.client;

  const overview = useMemo(() => {
    const addr = [client?.address, client?.city, client?.state, client?.zip_code]
      .map((x) => String(x || "").trim())
      .filter(Boolean)
      .join(", ");

    return {
      address: addr || "—",
      joinDate: client?.created_at ? formatDate(client.created_at) : "—",
    };
  }, [client]);

  if (loading) return <div className="p-6">Loading client profile...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!client) return <div className="p-6">Client not found</div>;

  const verified = Boolean(client.is_verified);

  const cases = data.cases || [];
  const appointments = data.appointments || [];
  const documents = data.documents || [];
  const billing = data.billing || [];
  const stats = data.stats || {};

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="text-[#142768] hover:underline mb-4 inline-flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <img
              src={avatarUrl(client.full_name)}
              alt={client.full_name}
              className="w-24 h-24 rounded-full border-4 border-[#142768] object-cover"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 truncate">
                  {client.full_name}
                </h1>

                <span
                  className={`px-3 py-1 text-xs rounded-full border ${statusPill(
                    verified
                  )}`}
                >
                  {verified ? "Verified" : "Pending"}
                </span>

                <span className="px-3 py-1 text-xs rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                  Client ID: {client.user_id}
                </span>
              </div>

              <p className="text-gray-600 mb-1">{client.email}</p>
              <p className="text-gray-600 mb-1">{client.phone || "—"}</p>
              <p className="text-sm text-gray-500">
                Member since {overview.joinDate}
              </p>
            </div>

            <div className="flex gap-3">
              {!verified ? (
                <button
                  onClick={async () => {
                    await verifyUser(client.user_id);
                    await loadAll();
                  }}
                  className="px-4 py-2 bg-[#142768] text-white rounded-lg hover:opacity-95 transition"
                >
                  Verify Client
                </button>
              ) : null}

              <Link
                to="/admin/users"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Clients
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4 overflow-x-auto">
            {["overview", "cases", "appointments", "documents", "billing"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "bg-[#142768] text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard title="Email" value={client.email} icon="📧" />
              <InfoCard title="Phone" value={client.phone || "—"} icon="📱" />
              <InfoCard title="Address" value={overview.address} icon="📍" />
              <InfoCard
                title="Status"
                value={verified ? "Verified" : "Pending"}
                icon="✓"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Cases" value={stats.totalCases || 0} />
              <StatCard title="Active Cases" value={stats.activeCases || 0} />
              <StatCard
                title="Upcoming Appointments"
                value={stats.upcomingAppointments || 0}
              />
              <StatCard title="Documents" value={stats.totalDocs || 0} />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Cases
              </h2>

              <div className="space-y-3">
                {cases.slice(0, 3).map((c) => (
                  <div
                    key={c.case_id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {c.title || "Untitled Case"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Lawyer: {c.lawyer_name || c.lawyer || "—"} •{" "}
                        {c.case_type || "—"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full border ${badge(
                        c.status
                      )}`}
                    >
                      {c.status || "—"}
                    </span>
                  </div>
                ))}

                {!cases.length ? (
                  <div className="text-gray-500">No cases found.</div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* CASES */}
        {activeTab === "cases" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Case History</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Lawyer
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cases.map((c) => (
                    <tr key={c.case_id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{c.title || "—"}</td>
                      <td className="p-4">{c.case_type || "—"}</td>
                      <td className="p-4">{c.lawyer_name || c.lawyer || "—"}</td>
                      <td className="p-4">
                        {c.created_at ? formatDate(c.created_at) : "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${badge(
                            c.status
                          )}`}
                        >
                          {c.status || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!cases.length ? (
                    <tr>
                      <td className="p-6 text-gray-500" colSpan={5}>
                        No cases found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Time
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Subject
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Lawyer
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Fee
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((a) => (
                    <tr
                      key={a.appointment_id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4">{a.appointment_date || "—"}</td>
                      <td className="p-4">{a.appointment_time || "—"}</td>
                      <td className="p-4 font-medium">{a.subject || "—"}</td>
                      <td className="p-4">{a.lawyer_name || a.lawyer || "—"}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${badge(
                            a.status
                          )}`}
                        >
                          {a.status || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        {a.final_fee != null
                          ? formatMoney(a.final_fee)
                          : a.offered_fee != null
                          ? formatMoney(a.offered_fee)
                          : a.proposed_fee != null
                          ? formatMoney(a.proposed_fee)
                          : "—"}
                      </td>
                    </tr>
                  ))}

                  {!appointments.length ? (
                    <tr>
                      <td className="p-6 text-gray-500" colSpan={6}>
                        No appointments found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Documents</h2>
              <p className="text-sm text-gray-500 mt-1">
                Click a card to preview.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {documents.map((doc) => {
                const url = toFileUrl(doc.file_path);
                return (
                  <button
                    key={doc.document_id}
                    type="button"
                    onClick={() => setDocModal({ url, name: doc.name })}
                    className="text-left border rounded-xl p-4 hover:shadow-md transition bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">
                        {isImage(url) ? "🖼️" : "📄"}
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {doc.doc_type || "Document"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {doc.name || "Untitled"}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Uploaded:{" "}
                      {doc.created_at ? formatDate(doc.created_at) : "—"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Size: {doc.file_size || "—"}
                    </p>

                    <div className="mt-4 inline-flex items-center text-[#142768] font-medium">
                      Preview →
                    </div>
                  </button>
                );
              })}

              {!documents.length ? (
                <div className="text-gray-500">No documents found.</div>
              ) : null}
            </div>
          </div>
        )}

        {/* BILLING */}
        {activeTab === "billing" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Billing</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Month
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {billing.map((b) => (
                    <tr key={b.billing_id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{b.billing_month || b.month || "—"}</td>
                      <td className="p-4 font-semibold">
                        {formatMoney(b.amount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full border ${badge(
                            b.status
                          )}`}
                        >
                          {b.status || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        {b.created_at ? formatDate(b.created_at) : "—"}
                      </td>
                    </tr>
                  ))}

                  {!billing.length ? (
                    <tr>
                      <td className="p-6 text-gray-500" colSpan={4}>
                        No billing history found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Document Modal */}
      {docModal?.url ? (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full relative">
            <button
              onClick={() => setDocModal(null)}
              className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 w-9 h-9 rounded-full flex items-center justify-center"
              title="Close"
            >
              ✕
            </button>

            <div className="p-6">
              <div className="font-semibold text-gray-900 mb-3">
                {docModal.name || "Document Preview"}
              </div>

              {isImage(docModal.url) ? (
                <img
                  src={docModal.url}
                  alt="Document"
                  className="max-h-[75vh] w-full object-contain border rounded-xl"
                />
              ) : (
                <iframe
                  src={docModal.url}
                  title="Document"
                  className="w-full h-[75vh] border rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ================= REUSABLE ================= */

const InfoCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
    <p className="font-semibold text-gray-900 break-words">{value}</p>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
  </div>
);

export default AdminClientProfile;