import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMyLawyerDashboard, getMyLawyerProfile } from "../../api/lawyersApi";
import { API_SERVER } from "../../api/http";


/* ================= AUTH HELPERS ================= */

// ✅ Adjust this based on how you store auth user
const getAuthUser = () => {
  try {
    // Common patterns
    const raw =
      localStorage.getItem("authUser") ||
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    if (!raw) return null;
    const u = JSON.parse(raw);
    return u && typeof u === "object" ? u : null;
  } catch {
    return null;
  }
};

const getAuthUserId = () => {
  const u = getAuthUser();
  const id = u?.user_id ?? u?.id ?? u?._id ?? null;
  return id != null ? Number(id) : null;
};

const getAuthRole = () => {
  const u = getAuthUser();
  return String(u?.role || "").toLowerCase();
};

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

const formatTime = (t) => {
  if (!t) return "—";
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
};

const formatMoney = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;

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

const statusPill = (ok) =>
  ok
    ? "bg-green-100 text-green-700 border border-green-200"
    : "bg-yellow-100 text-yellow-700 border border-yellow-200";

const splitSpecs = (str) =>
  String(str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "Lawyer"
  )}&size=200&background=142768&color=fff`;

const feeFromAppt = (a) => {
  if (!a) return null;
  if (a.final_fee != null) return a.final_fee;
  if (a.offered_fee != null) return a.offered_fee;
  if (a.proposed_fee != null) return a.proposed_fee;
  return null;
};

/* ================= PAGE ================= */

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const { lawyerId } = useParams(); // ✅ if present => admin view usually

  const [activeTab, setActiveTab] = useState("overview");

  const [bundle, setBundle] = useState({
    lawyer: null,
    stats: {},
    appointments: [],
    cases: [],
    documents: [],
    messages: [],
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [previewModal, setPreviewModal] = useState(null); // { url, name }
  const [licenseModal, setLicenseModal] = useState(null); // url

  // ✅ Determine viewer
  const authRole = useMemo(() => getAuthRole(), []);
  const authUserId = useMemo(() => getAuthUserId(), []);

  // If URL has :lawyerId => admin is viewing a specific lawyer
  const isAdminView = useMemo(() => {
    return Boolean(lawyerId) && authRole === "admin";
  }, [lawyerId, authRole]);

  // Self view when no param (lawyer dashboard) OR param matches logged-in lawyer id
  const isSelfView = useMemo(() => {
    if (authRole !== "lawyer") return false;
    if (!authUserId) return false;

    // /lawyer/dashboard (no lawyerId) => self
    if (!lawyerId) return true;

    // /lawyer/:lawyerId/dashboard (rare) => self only if matches
    return Number(lawyerId) === Number(authUserId);
  }, [authRole, authUserId, lawyerId]);

  // ✅ Only show these for self logged-in lawyer
  const showSelfControls = isSelfView;
  const showMessagesTab = isSelfView; // you asked: messages tab only for self

  const loadAll = async () => {
    setLoading(true);
    setErr("");
    try {
      let res;

      if (isAdminView) {
        // ✅ Admin viewing specific lawyer
        // Requires backend route + API method getLawyerDashboardById(lawyerId)
        res = await getMyLawyerProfile();
      } else {
        // ✅ Self lawyer dashboard
        res = await getMyLawyerProfile();
      }

      setBundle({
        lawyer: res || null,
        stats: res?.stats || {},
        appointments: Array.isArray(res?.appointments) ? res.appointments : [],
        cases: Array.isArray(res?.cases) ? res.cases : [],
        documents: Array.isArray(res?.documents) ? res.documents : [],
        messages: Array.isArray(res?.messages) ? res.messages : [],
      });
    } catch (e) {
      setErr(e?.message || "Failed to load lawyer dashboard");
      setBundle({
        lawyer: null,
        stats: {},
        appointments: [],
        cases: [],
        documents: [],
        messages: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lawyerId, isAdminView]);

  const profile = bundle.lawyer;
  const stats = bundle.stats || {};
  const appointments = bundle.appointments || [];
  const cases = bundle.cases || [];
  const documents = bundle.documents || [];
  const messages = bundle.messages || [];

  const verified = useMemo(() => {
    if (!profile) return false;
    const v =
      profile.is_verified ??
      profile.lawyer_verified ??
      profile.user_verified ??
      0;
    return Number(v) === 1 || v === true;
  }, [profile]);

  const specs = useMemo(() => splitSpecs(profile?.specialization), [profile]);

  const licenseUrl = useMemo(() => toFileUrl(profile?.license_document), [profile]);

  const overviewCards = useMemo(
    () => [
      { title: "Email", value: profile?.email || "—", icon: "📧" },
      { title: "Phone", value: profile?.phone || "—", icon: "📱" },
      { title: "Status", value: verified ? "Verified" : "Pending", icon: "✅" },
      {
        title: "Hourly Rate",
        value: profile?.hourly_rate != null ? formatMoney(profile.hourly_rate) : "—",
        icon: "💰",
      },
    ],
    [profile, verified]
  );

  const computedUpcomingAppointments = useMemo(() => {
    return appointments.filter(
      (a) =>
        !["completed", "cancelled", "rejected"].includes(
          String(a.status || "").toLowerCase()
        )
    ).length;
  }, [appointments]);

  // ✅ Tabs list is role-aware
  const tabs = useMemo(() => {
    const base = [
      { key: "overview", label: "Overview" },
      { key: "appointments", label: "Appointments" },
      { key: "cases", label: "Case History" },
      { key: "documents", label: "Documents" },
    ];

    if (showMessagesTab) base.push({ key: "messages", label: "Messages" });

    return base;
  }, [showMessagesTab]);

  if (loading) return <div className="p-10 text-center">Loading dashboard…</div>;
  if (err) return <div className="p-10 text-center text-red-600">{err}</div>;
  if (!profile) return <div className="p-10 text-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-5">
              <img
                src={avatarUrl(profile.full_name)}
                alt={profile.full_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#142768] object-cover"
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    {profile.full_name}
                  </h1>

                  <span className={`px-3 py-1 text-xs rounded-full border ${statusPill(verified)}`}>
                    {verified ? "Verified Lawyer" : "Pending Verification"}
                  </span>

                  <span className="px-3 py-1 text-xs rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                    Lawyer ID: {profile.lawyer_id || profile.user_id || "—"}
                  </span>

                  {/* ✅ Optional: show viewer context */}
                  {isAdminView ? (
                    <span className="px-3 py-1 text-xs rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                      Admin View
                    </span>
                  ) : null}
                </div>

                <p className="text-gray-600 mt-1 truncate">
                  {profile.email} {profile.phone ? `• ${profile.phone}` : ""}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {specs.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#142768] border"
                    >
                      {s}
                    </span>
                  ))}
                  {specs.length > 4 ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      +{specs.length - 4} more
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* ✅ SELF-ONLY CONTROLS */}
            {showSelfControls ? (
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <button
                  onClick={() => loadAll()}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition"
                >
                  Refresh
                </button>

                <button
                  onClick={() => navigate("/lawyer/profile/edit")}
                  className="px-4 py-2 rounded-lg bg-[#142768] text-white hover:opacity-95 transition"
                >
                  Edit Profile
                </button>

                <Link
                  to="/"
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition text-center"
                >
                  Home
                </Link>
              </div>
            ) : (
              // ✅ ADMIN VIEW: show only back button (optional)
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3 py-4 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === t.key
                    ? "bg-[#142768] text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewCards.map((c) => (
                <InfoCard key={c.title} title={c.title} value={c.value} icon={c.icon} />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Appointments" value={stats.totalAppointments ?? appointments.length} />
              <StatCard title="Upcoming" value={stats.upcomingAppointments ?? computedUpcomingAppointments} />
              <StatCard title="Total Cases" value={stats.totalCases ?? cases.length} />
              <StatCard title="Documents" value={stats.totalDocs ?? documents.length} />
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#142768]">License Document</h2>
                {licenseUrl ? (
                  <button
                    onClick={() => setLicenseModal(licenseUrl)}
                    className="text-sm text-[#142768] hover:underline"
                  >
                    Open Full
                  </button>
                ) : null}
              </div>

              {!licenseUrl ? (
                <div className="text-gray-500">No license document uploaded.</div>
              ) : (
                <button
                  onClick={() => setLicenseModal(licenseUrl)}
                  className="w-full border rounded-xl overflow-hidden hover:shadow transition"
                >
                  {isImage(licenseUrl) ? (
                    <img
                      src={licenseUrl}
                      alt="license"
                      className="max-h-72 w-full object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="p-10 text-gray-600 text-center">Open Document</div>
                  )}
                </button>
              )}
            </div>

            <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-3">
              <h2 className="text-lg font-semibold text-[#142768]">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || "No bio provided yet."}
              </p>

              <div>
                <div className="text-xs text-gray-500 mb-2">Specializations</div>
                <div className="flex flex-wrap gap-2">
                  {specs.length ? (
                    specs.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#142768] border"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
              <p className="text-sm text-gray-500 mt-1">Review bookings, statuses, and fees.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Client</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Subject</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Fee</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.appointment_id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        {a.appointment_date ? formatDate(a.appointment_date) : "—"}
                      </td>
                      <td className="p-4">{formatTime(a.appointment_time)}</td>
                      <td className="p-4">{a.client_name || "—"}</td>
                      <td className="p-4 font-medium">{a.subject || "—"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${badge(a.status)}`}>
                          {a.status || "—"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">
                        {feeFromAppt(a) != null ? formatMoney(feeFromAppt(a)) : "—"}
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

        {/* CASES */}
        {activeTab === "cases" && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Case History</h2>
              <p className="text-sm text-gray-500 mt-1">Track cases assigned to this lawyer.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Client</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Created</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {cases.map((c) => (
                    <tr key={c.case_id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{c.title || "—"}</td>
                      <td className="p-4">{c.case_type || "—"}</td>
                      <td className="p-4">{c.client_name || "—"}</td>
                      <td className="p-4">{c.created_at ? formatDate(c.created_at) : "—"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${badge(c.status)}`}>
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

        {/* DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Documents</h2>
              <p className="text-sm text-gray-500 mt-1">Client documents (click to preview).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {documents.map((doc) => {
                const url = toFileUrl(doc.file_path);
                return (
                  <button
                    key={doc.document_id}
                    type="button"
                    onClick={() => setPreviewModal({ url, name: doc.name })}
                    className="text-left border rounded-xl p-4 hover:shadow-md transition bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{isImage(url) ? "🖼️" : "📄"}</div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {doc.doc_type || "Document"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {doc.name || "Untitled"}
                    </h3>

                    <p className="text-xs text-gray-500">
                      Uploaded: {doc.created_at ? formatDate(doc.created_at) : "—"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">Size: {doc.file_size || "—"}</p>

                    <div className="mt-4 inline-flex items-center text-[#142768] font-medium">
                      Preview →
                    </div>
                  </button>
                );
              })}

              {!documents.length ? <div className="text-gray-500">No documents found.</div> : null}
            </div>
          </div>
        )}

        {/* MESSAGES - SELF ONLY */}
        {activeTab === "messages" && showMessagesTab && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              <p className="text-sm text-gray-500 mt-1">Latest appointment messages.</p>
            </div>

            <div className="p-6 space-y-3">
              {messages.slice(0, 50).map((m) => (
                <div key={m.message_id} className="border rounded-xl p-4 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900">
                      {m.sender_name || "Unknown"}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        • {m.sender_role || "—"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {m.created_at ? formatDate(m.created_at) : "—"}
                    </div>
                  </div>

                  <div className="mt-2 text-gray-700 text-sm">{m.message || "—"}</div>

                  <div className="mt-2 text-xs text-gray-500">
                    Appointment ID: {m.appointment_id}
                  </div>
                </div>
              ))}

              {!messages.length ? <div className="text-gray-500">No messages found.</div> : null}
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {previewModal?.url ? (
        <Modal title={previewModal.name || "Document Preview"} onClose={() => setPreviewModal(null)}>
          {isImage(previewModal.url) ? (
            <img
              src={previewModal.url}
              alt="Document"
              className="max-h-[75vh] w-full object-contain border rounded-xl"
            />
          ) : (
            <iframe src={previewModal.url} title="Document" className="w-full h-[75vh] border rounded-xl" />
          )}
        </Modal>
      ) : null}

      {licenseModal ? (
        <Modal title="License Document" onClose={() => setLicenseModal(null)}>
          {isImage(licenseModal) ? (
            <img
              src={licenseModal}
              alt="License"
              className="max-h-[75vh] w-full object-contain border rounded-xl"
            />
          ) : (
            <iframe src={licenseModal} title="License" className="w-full h-[75vh] border rounded-xl" />
          )}
        </Modal>
      ) : null}

      <p className="text-xs text-gray-500 text-center pb-8">
        HireLawyer does not assume responsibility or liability for the authenticity or accuracy of documents
        submitted by lawyers.
      </p>
    </div>
  );
};

/* ================= REUSABLE ================= */

const InfoCard = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
    <p className="font-semibold text-gray-900 break-words">{value}</p>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 w-9 h-9 rounded-full flex items-center justify-center"
        title="Close"
      >
        ✕
      </button>

      <div className="p-6">
        <div className="font-semibold text-gray-900 mb-3">{title}</div>
        {children}
      </div>
    </div>
  </div>
);

export default LawyerDashboard;