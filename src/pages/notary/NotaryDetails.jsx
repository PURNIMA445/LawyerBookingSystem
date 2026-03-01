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
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap";

  if (s === "verified") return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
  if (s === "notarized") return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
  if (["paid", "in_review", "submitted"].includes(s))
    return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
  if (["rejected", "cancelled"].includes(s))
    return `${base} bg-rose-50 text-rose-700 ring-rose-200`;

  return `${base} bg-gray-50 text-gray-700 ring-gray-200`;
};

const pill = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap";

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

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Loading notary request…</div>;
  if (err) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-rose-600">{err}</div>;
  if (!item) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">Notary request not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-10">
        {/* TOP BAR */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 sm:px-8 py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#142768] hover:underline"
                >
                  <span aria-hidden>←</span> Back
                </button>

                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 break-words">
                  {item.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={badge(item.status)}>{item.status}</span>

                  <span className={`${pill} bg-gray-50 text-gray-700 ring-gray-200 capitalize`}>
                    urgency: {String(item.urgency || "—").replace(/_/g, " ")}
                  </span>

                  <span className={`${pill} bg-gray-50 text-gray-700 ring-gray-200 capitalize`}>
                    payment: {String(item.payment_status || "—").replace(/_/g, " ")}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  Type: <span className="text-gray-900 font-semibold">{item.doc_type}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  Created: <span className="text-gray-900 font-semibold">{formatDate(item.created_at)}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  onClick={load}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Refresh
                </button>

                {canPay ? (
                  <button
                    onClick={onPay}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-xl bg-[#142768] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    Pay Rs. {Number(item.amount || 0).toFixed(2)}
                  </button>
                ) : null}

                {canVerify ? (
                  <button
                    onClick={onVerify}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    Verify &amp; Accept
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Client Doc */}
          <Card
            title="Client Document"
            subtitle="Original uploaded document"
            right={
              clientDocUrl ? (
                <a
                  href={clientDocUrl}
                  className="text-sm font-semibold text-[#142768] hover:underline"
                  download = {clientDocUrl}
                >
                  Download →
                </a>
              ) : null
            }
          >
            {!clientDocUrl ? (
              <EmptyState text="No client document." />
            ) : (
              <button
                onClick={() => setModal({ url: clientDocUrl, title: "Client Document" })}
                className="group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {isImage(clientDocUrl) ? (
                  <div className="bg-gray-50">
                    <img
                      src={clientDocUrl}
                      alt="client"
                      className="max-h-[420px] w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {isPdf(clientDocUrl) ? "Open PDF Preview" : "Open Document"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Click to preview in modal
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                  <span className="truncate">{clientDocUrl.split("/").pop()}</span>
                  <span className="font-semibold text-[#142768]">Preview →</span>
                </div>
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
                  className="text-sm font-semibold text-[#142768] hover:underline"
                >
                  Download →
                </a>
              ) : null
            }
          >
            {!finalDocUrl ? (
              <EmptyState text="Not notarized yet." />
            ) : (
              <button
                onClick={() => setModal({ url: finalDocUrl, title: "Notarized Document" })}
                className="group w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {isImage(finalDocUrl) ? (
                  <div className="bg-gray-50">
                    <img
                      src={finalDocUrl}
                      alt="final"
                      className="max-h-[420px] w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {isPdf(finalDocUrl) ? "Open PDF Preview" : "Open Document"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Click to preview in modal
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
                  <span className="truncate">{finalDocUrl.split("/").pop()}</span>
                  <span className="font-semibold text-[#142768]">Preview →</span>
                </div>
              </button>
            )}

            {canUploadNotarized ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="text-sm font-semibold text-gray-900">Lawyer Upload</div>
                <p className="text-xs text-gray-600 mt-1">Upload notarized image or PDF.</p>

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />

                <button
                  onClick={onUpload}
                  disabled={!uploadFile || saving}
                  className="mt-4 inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Upload Notarized Document
                </button>
              </div>
            ) : null}
          </Card>
        </div>

        {/* META */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 sm:px-8 py-6 border-b border-gray-100">
            <h3 className="text-lg font-extrabold tracking-tight text-gray-900">Request Info</h3>
            <p className="mt-1 text-sm text-gray-600">Reference details and audit fields.</p>
          </div>

          <div className="px-6 sm:px-8 py-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Info label="Notary ID" value={item.notary_id} />
              <Info label="Client" value={item.client_name || item.client_id} />
              <Info label="Lawyer" value={item.lawyer_name || (item.lawyer_id ? `#${item.lawyer_id}` : "—")} />
              <Info label="Payment Ref" value={item.payment_ref || "—"} />
              <Info label="Updated" value={formatDate(item.updated_at)} />
              <Info label="Amount" value={`Rs. ${Number(item.amount || 0).toFixed(2)}`} />
            </div>
          </div>
        </div>

        {modal?.url ? (
          <Modal title={modal.title} onClose={() => setModal(null)}>
            {isImage(modal.url) ? (
              <img
                src={modal.url}
                alt="preview"
                className="max-h-[75vh] w-full object-contain rounded-xl border border-gray-200 bg-white"
              />
            ) : (
              <iframe
                src={modal.url}
                title="doc"
                className="w-full h-[75vh] rounded-xl border border-gray-200 bg-white"
              />
            )}
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, right, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <div className="px-6 sm:px-7 py-6 border-b border-gray-100 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-600 mt-1 leading-relaxed">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>

    <div className="px-6 sm:px-7 py-6">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
    <div className="text-xs font-semibold text-gray-500">{label}</div>
    <div className="mt-2 font-semibold text-gray-900 break-words">{value}</div>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
    <div className="text-sm font-semibold text-gray-900">{text}</div>
    <div className="mt-1 text-xs text-gray-500">When available, you can preview it here.</div>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50">
    {/* overlay */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
    />

    {/* panel */}
    <div className="relative h-full w-full p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-white/20 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <div className="text-sm font-extrabold text-gray-900 truncate">{title}</div>
            <div className="text-xs text-gray-500 mt-0.5">Preview</div>
          </div>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 w-10 h-10 text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-200"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  </div>
);

export default NotaryDetails;