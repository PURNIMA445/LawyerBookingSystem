import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listNotary } from "../../api/notaryApi";

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

const badge = (status) => {
  const s = String(status || "").toLowerCase();
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset";

  if (s === "verified") return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
  if (s === "notarized") return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
  if (["paid", "submitted", "in_review"].includes(s))
    return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
  if (["rejected", "cancelled"].includes(s))
    return `${base} bg-rose-50 text-rose-700 ring-rose-200`;

  return `${base} bg-gray-50 text-gray-700 ring-gray-200`;
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
    const norm = (v) => String(v || "").toLowerCase();
    return {
      total: items.length,
      paid: items.filter((x) => norm(x.payment_status) === "paid").length,
      notarized: items.filter((x) => norm(x.status) === "notarized").length,
      verified: items.filter((x) => norm(x.status) === "verified").length,
    };
  }, [items]);

  if (loading) return <div className="p-8">Loading notary requests…</div>;
  if (err) return <div className="p-8 text-red-600">{err}</div>;

  return (
    <div className="space-y-8 m-10">
      {/* HEADER */}
      <div className="rounded-2xl border bg-white px-8 py-7 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Notary Services
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Track notarization requests, payment status, and completed documents.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={load}
              className="rounded-xl border bg-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              Refresh
            </button>

            <button
              onClick={() => navigate("/notary/new")}
              className="rounded-xl bg-[#142768] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
            >
              + New Request
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-5">
          <StatCard label="Total" value={totals.total} />
          <StatCard label="Paid" value={totals.paid} />
          <StatCard label="Notarized" value={totals.notarized} />
          <StatCard label="Verified" value={totals.verified} />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b">
          <div>
            <div className="text-sm font-semibold text-gray-900">Requests</div>
            <div className="text-xs text-gray-500 mt-1">
              {items.length} total records
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-xs uppercase tracking-wide text-gray-600">
                <th className="px-8 py-4 text-left font-semibold">Title</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Urgency</th>
                <th className="px-6 py-4 text-left font-semibold">Client</th>
                <th className="px-6 py-4 text-left font-semibold">Lawyer</th>
                <th className="px-6 py-4 text-left font-semibold">Payment</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Created</th>
                <th className="px-8 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {items.map((n, i) => (
                <tr
                  key={n.notary_id}
                  className={`transition-colors ${
                    i % 2 ? "bg-gray-50/40" : "bg-white"
                  } hover:bg-indigo-50/40`}
                >
                  <td className="px-8 py-5">
                    <div className="font-semibold text-gray-900">{n.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      #{n.notary_id}
                    </div>
                  </td>

                  <td className="px-6 py-5">{n.doc_type}</td>

                  <td className="px-6 py-5 capitalize">{n.urgency}</td>

                  <td className="px-6 py-5">{n.client_name || n.client_id}</td>

                  <td className="px-6 py-5">
                    {n.lawyer_name || (n.lawyer_id ? `#${n.lawyer_id}` : "—")}
                  </td>

                  <td className="px-6 py-5 capitalize">{n.payment_status}</td>

                  <td className="px-6 py-5">
                    <span className={badge(n.status)}>{n.status}</span>
                  </td>

                  <td className="px-6 py-5">{formatDate(n.created_at)}</td>

                  <td className="px-8 py-5 text-right">
                    <Link
                      to={`/notary/${n.notary_id}`}
                      className="rounded-lg border px-4 py-2 text-sm font-semibold text-[#142768] hover:bg-gray-50"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan={9} className="px-8 py-16 text-center text-gray-500">
                    No notary requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border bg-white px-6 py-5 shadow-sm">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

export default NotaryList;