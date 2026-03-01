import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNotary } from "../../api/notaryApi";

const NotaryCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("Affidavit");
  const [urgency, setUrgency] = useState("normal");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const amountPreview = useMemo(() => {
    return urgency === "urgent" ? 1500 : 800;
  }, [urgency]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!title.trim()) return setErr("Title is required");
    if (!docType.trim()) return setErr("Document type is required");
    if (!file) return setErr("Please upload a document image");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("doc_type", docType);
    fd.append("urgency", urgency);
    fd.append("document", file);

    setLoading(true);
    try {
      const res = await createNotary(fd);
      const id = res?.item?.notary_id;
      if (id) navigate(`/notary/${id}`);
      else navigate(`/notary`);
    } catch (e2) {
      setErr(e2?.message || "Failed to create notary request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 sm:px-8 py-7 border-b border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#142768] hover:underline"
            >
              <span aria-hidden>←</span> Back
            </button>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              New Notary Request
            </h1>

            <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-2xl">
              Upload a document (image), choose type &amp; urgency, then pay to proceed.
            </p>

            {err ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {err}
              </div>
            ) : null}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-6 sm:px-8 py-7">
            <div className="space-y-6">
              <Field label="Title" hint="Give this request a clear name for tracking.">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g., Notarize Citizenship Copy"
                />
              </Field>

              <Field label="Document Type" hint="Example: Affidavit, Agreement, ID Copy, Authorization Letter.">
                <input
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="e.g., Affidavit, Agreement, ID Copy..."
                />
              </Field>

              <Field label="Urgency" hint="Urgent requests cost more and are prioritized.">
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="normal">Normal (Rs. 800)</option>
                  <option value="urgent">Urgent (Rs. 1500)</option>
                </select>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
                  Estimated charge: <span className="text-gray-900">Rs. {amountPreview}</span>
                </div>
              </Field>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <Field label="Upload Document (Image)" hint="Upload a clear photo/scan (JPG/PNG/WebP).">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />

                  {file ? (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {file.name}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="shrink-0 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-gray-600">
                      Tip: Use a well-lit, cropped image for faster verification.
                    </div>
                  )}
                </Field>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-[#142768] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {loading ? "Submitting..." : "Create Request"}
                </button>
              </div>
            </div>
          </form>

          {/* Footer spacer */}
          <div className="h-2 bg-white" />
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <div className="space-y-2">
    <div>
      <div className="text-sm font-semibold text-gray-900">{label}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
    {children}
  </div>
);

export default NotaryCreate;