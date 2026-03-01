import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listNotary } from "../../api/notaryApi";

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

const NotaryList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await listNotary();
      setItems(Array.isArray(res?.items) ? res.items : []);
    } catch (e) {
      setErr(e?.message || "Failed to load notary requests");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    return {
      total: items.length,
      paid: items.filter((x) => String(x.payment_status).toLowerCase() === "paid").length,
      notarized: items.filter((x) => String(x.status).toLowerCase() === "notarized").length,
      verified: items.filter((x) => String(x.status).toLowerCase() === "verified").length,
    };
  }, [items]);

  if (loading) return <div className="p-6">Loading notary requests…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notary Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track notarization requests, payments, and final documents.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
          >
            Refresh
          </button>

          <button
            onClick={() => navigate("/notary/new")}
            className="px-4 py-2 rounded-lg bg-[#142768] text-white hover:opacity-95"
          >
            + New Request
          </button>
        </div>
      </div>

      {/* quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card label="Total" value={totals.total} />
        <Card label="Paid" value={totals.paid} />
        <Card label="Notarized" value={totals.notarized} />
        <Card label="Verified" value={totals.verified} />
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="text-left">Type</th>
              <th className="text-left">Urgency</th>
              <th className="text-left">Client</th>
              <th className="text-left">Lawyer</th>
              <th className="text-left">Payment</th>
              <th className="text-left">Status</th>
              <th className="text-left">Created</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((n) => (
              <tr key={n.notary_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{n.title}</td>
                <td>{n.doc_type}</td>
                <td className="capitalize">{n.urgency}</td>
                <td>{n.client_name || n.client_id}</td>
                <td>{n.lawyer_name || (n.lawyer_id ? `#${n.lawyer_id}` : "—")}</td>
                <td className="capitalize">{n.payment_status}</td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded-full border ${badge(n.status)}`}>
                    {n.status}
                  </span>
                </td>
                <td>{formatDate(n.created_at)}</td>
                <td className="p-3 text-right">
                  <Link
                    to={`/notary/${n.notary_id}`}
                    className="text-[#142768] hover:underline"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">
                  No notary requests found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div className="bg-white border rounded-xl p-4">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
  </div>
);

export default NotaryList;