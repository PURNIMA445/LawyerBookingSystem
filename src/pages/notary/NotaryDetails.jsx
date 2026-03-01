import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_SERVER } from "../../api/http";
import { getNotaryById, notarizeNotary, payNotary, verifyNotary } from "../../api/notaryApi";

/* ===== auth helpers (same style you used) ===== */
const getAuthUser = () => {
  try {
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
const getAuthRole = () => String(getAuthUser()?.role || "").toLowerCase();

/* ===== helpers ===== */

const toFileUrl = (p) => {
  if (!p) return "";
  const normalized = String(p).split("\\").join("/");
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `${API_SERVER}/${normalized.replace(/^\/+/, "")}`;
};

const isImage = (url) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url || "");
const isPdf = (url) => /\.pdf$/i.test(url || "");

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const badge = (status) => {
  const s = String(status || "").toLowerCase();
  if (["verified"].includes(s)) return "bg-green-100 text-green-700 border border-green-200";
  if (["notarized"].includes(s)) return "bg-blue-100 text-blue-700 border border-blue-200";
  if (["paid", "in_review", "submitted"].includes(s)) return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  if (["rejected", "cancelled"].includes(s)) return "bg-red-100 text-red-700 border border-red-200";
  return "bg-gray-100 text-gray-700 border border-gray-200";
};

const NotaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useMemo(() => getAuthRole(), []);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [modal, setModal] = useState(null); // { url, title }
  const [uploadFile, setUploadFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await getNotaryById(id);
      setItem(res?.item || null);
    } catch (e) {
      setErr(e?.message || "Failed to load notary details");
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const clientDocUrl = useMemo(() => toFileUrl(item?.client_document_path), [item]);
  const finalDocUrl = useMemo(() => toFileUrl(item?.notarized_document_path), [item]);

  const canPay = useMemo(() => {
    if (role !== "client") return false;
    return String(item?.payment_status || "").toLowerCase() !== "paid";
  }, [role, item]);

  const canVerify = useMemo(() => {
    if (role !== "client") return false;
    return String(item?.status || "").toLowerCase() === "notarized" && Boolean(item?.notarized_document_path);
  }, [role, item]);

  const canUploadNotarized = useMemo(() => {
    if (role !== "lawyer") return false;
    const paid = String(item?.payment_status || "").toLowerCase() === "paid";
    return paid;
  }, [role, item]);

  const onPay = async () => {
    setSaving(true);
    try {
      await payNotary(id, { payment_ref: `MANUAL_${Date.now()}` }); // replace with gateway later
      await load();
    } catch (e) {
      setErr(e?.message || "Payment failed");
    } finally {
      setSaving(false);
    }
  };

  const onVerify = async () => {
    setSaving(true);
    try {
      await verifyNotary(id);
      await load();
    } catch (e) {
      setErr(e?.message || "Verify failed");
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async () => {
    if (!uploadFile) return;
    setSaving(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("notarized_document", uploadFile);
      await notarizeNotary(id, fd);
      setUploadFile(null);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to upload notarized document");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading notary request…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!item) return <div className="p-6">Notary request not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button onClick={() => navigate(-1)} className="text-[#142768] hover:underline">
            ← Back
          </button>
          <h1 className="text-2xl font-bold mt-2">{item.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`px-3 py-1 text-xs rounded-full border ${badge(item.status)}`}>
              {item.status}
            </span>
            <span className="px-3 py-1 text-xs rounded-full border bg-gray-100 text-gray-700 border-gray-200 capitalize">
              urgency: {item.urgency}
            </span>
            <span className="px-3 py-1 text-xs rounded-full border bg-gray-100 text-gray-700 border-gray-200 capitalize">
              payment: {item.payment_status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Type: <span className="text-gray-800 font-medium">{item.doc_type}</span> • Created:{" "}
            <span className="text-gray-800 font-medium">{formatDate(item.created_at)}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50">
            Refresh
          </button>

          {canPay ? (
            <button
              onClick={onPay}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#142768] text-white hover:opacity-95 disabled:opacity-60"
            >
              Pay Rs. {Number(item.amount || 0).toFixed(2)}
            </button>
          ) : null}

          {canVerify ? (
            <button
              onClick={onVerify}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:opacity-95 disabled:opacity-60"
            >
              Verify & Accept
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Client Doc */}
        <Card
          title="Client Document"
          subtitle="Original uploaded document"
          right={
            clientDocUrl ? (
              <a
                href={clientDocUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#142768] hover:underline"
              >
                Download →
              </a>
            ) : null
          }
        >
          {!clientDocUrl ? (
            <div className="text-gray-500">No client document</div>
          ) : (
            <button
              onClick={() => setModal({ url: clientDocUrl, title: "Client Document" })}
              className="w-full border rounded-xl overflow-hidden hover:shadow transition bg-white"
            >
              {isImage(clientDocUrl) ? (
                <img src={clientDocUrl} alt="client" className="max-h-96 w-full object-contain bg-gray-50" />
              ) : (
                <div className="p-10 text-gray-600 text-center">
                  {isPdf(clientDocUrl) ? "Open PDF Preview" : "Open Document"}
                </div>
              )}
            </button>
          )}
        </Card>

        {/* Final Doc */}
        <Card
          title="Notarized Document"
          subtitle="Final document uploaded by lawyer"
          right={
            finalDocUrl ? (
              <a
                href={finalDocUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#142768] hover:underline"
              >
                Download →
              </a>
            ) : null
          }
        >
          {!finalDocUrl ? (
            <div className="text-gray-500">Not notarized yet.</div>
          ) : (
            <button
              onClick={() => setModal({ url: finalDocUrl, title: "Notarized Document" })}
              className="w-full border rounded-xl overflow-hidden hover:shadow transition bg-white"
            >
              {isImage(finalDocUrl) ? (
                <img src={finalDocUrl} alt="final" className="max-h-96 w-full object-contain bg-gray-50" />
              ) : (
                <div className="p-10 text-gray-600 text-center">
                  {isPdf(finalDocUrl) ? "Open PDF Preview" : "Open Document"}
                </div>
              )}
            </button>
          )}

          {canUploadNotarized ? (
            <div className="mt-4 border-t pt-4">
              <div className="text-sm font-semibold text-gray-800">Lawyer Upload</div>
              <p className="text-xs text-gray-500 mt-1">Upload notarized image or PDF.</p>

              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="mt-3 w-full border rounded-xl px-3 py-2 bg-white"
              />

              <button
                onClick={onUpload}
                disabled={!uploadFile || saving}
                className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-95 disabled:opacity-60"
              >
                Upload Notarized Document
              </button>
            </div>
          ) : null}
        </Card>
      </div>

      {/* meta */}
      <div className="bg-white border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800">Request Info</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
          <Info label="Notary ID" value={item.notary_id} />
          <Info label="Client" value={item.client_name || item.client_id} />
          <Info label="Lawyer" value={item.lawyer_name || (item.lawyer_id ? `#${item.lawyer_id}` : "—")} />
          <Info label="Payment Ref" value={item.payment_ref || "—"} />
          <Info label="Updated" value={formatDate(item.updated_at)} />
          <Info label="Amount" value={`Rs. ${Number(item.amount || 0).toFixed(2)}`} />
        </div>
      </div>

      {modal?.url ? (
        <Modal title={modal.title} onClose={() => setModal(null)}>
          {isImage(modal.url) ? (
            <img src={modal.url} alt="preview" className="max-h-[75vh] w-full object-contain border rounded-xl" />
          ) : (
            <iframe src={modal.url} title="doc" className="w-full h-[75vh] border rounded-xl" />
          )}
        </Modal>
      ) : null}
    </div>
  );
};

const Card = ({ title, subtitle, right, children }) => (
  <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
    <div className="p-6 border-b flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="border rounded-xl p-3 bg-gray-50">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="font-semibold text-gray-900 mt-1 break-words">{value}</div>
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

export default NotaryDetails;