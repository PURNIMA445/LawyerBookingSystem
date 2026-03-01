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
    <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold">New Notary Request</h1>
      <p className="text-sm text-gray-500 mt-1">
        Upload a document (image), choose type & urgency, then pay to proceed.
      </p>

      {err ? <div className="mt-4 text-sm text-red-600">{err}</div> : null}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
            placeholder="e.g., Notarize Citizenship Copy"
          />
        </Field>

        <Field label="Document Type">
          <input
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
            placeholder="e.g., Affidavit, Agreement, ID Copy..."
          />
        </Field>

        <Field label="Urgency">
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full border rounded-xl px-4 py-2"
          >
            <option value="normal">Normal (Rs. 800)</option>
            <option value="urgent">Urgent (Rs. 1500)</option>
          </select>
        </Field>

        <Field label="Upload Document (Image)">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded-xl px-4 py-2 bg-white"
          />
          <div className="text-xs text-gray-500 mt-2">
            Estimated charge: <span className="font-semibold">Rs. {amountPreview}</span>
          </div>
        </Field>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#142768] text-white hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Create Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
    {children}
  </div>
);

export default NotaryCreate;