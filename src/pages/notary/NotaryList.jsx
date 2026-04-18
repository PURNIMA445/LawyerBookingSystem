import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listNotary } from "../../api/notaryApi";
import { isLoggedIn } from "../../api/userApi";

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
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap";

  if (s === "verified")
    return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
  if (s === "notarized")
    return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
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

  const {role} = isLoggedIn()
  console.log(role)

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

  if (loading) return <div className="px-4 sm:px-6 lg:px-8 py-10">Loading notary requests…</div>;
  if (err) return <div className="px-4 sm:px-6 lg:px-8 py-10 text-rose-600">{err}</div>;

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-10">
        {/* HEADER */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 sm:px-8 py-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  Notary Services
                </h1>
                <p className="mt-2 text-sm text-gray-600 max-w-2xl leading-relaxed">
                  Track notarization requests, payment status, and completed documents.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <button
                  onClick={load}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Refresh
                </button>

                <button
                  onClick={() => navigate("/notary/new")}
                  className="inline-flex items-center justify-center rounded-xl bg-[#142768] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
        </div>

        {/* TABLE */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">Requests</div>
                <div className="text-xs text-gray-500 mt-1">
                  Showing <span className="font-semibold text-gray-700">{items.length}</span>{" "}
                  {items.length === 1 ? "record" : "records"}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-275 w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur border-b border-gray-200">
                <tr className="text-[11px] uppercase tracking-wider text-gray-600">
                  <th className="px-6 sm:px-8 py-4 text-left font-semibold">Title</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Urgency</th>
                  <th className="px-6 py-4 text-left font-semibold">Client</th>
                  <th className="px-6 py-4 text-left font-semibold">Lawyer</th>
                  <th className="px-6 py-4 text-left font-semibold">Payment</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Created</th>
                  <th className="px-6 sm:px-8 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.map((n, i) => (
                  <tr
                    key={n.notary_id}
                    className={[
                      "transition-colors",
                      i % 2 ? "bg-gray-50/40" : "bg-white",
                      "hover:bg-indigo-50/40",
                    ].join(" ")}
                  >
                    <td className="px-6 sm:px-8 py-5">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {n.title || "—"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: <span className="font-medium text-gray-700">#{n.notary_id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 whitespace-nowrap">
                        {n.doc_type || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 whitespace-nowrap capitalize">
                        {(n.urgency || "—").toString().replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-700 whitespace-nowrap">
                      {n.client_name || n.client_id || "—"}
                    </td>

                    <td className="px-6 py-5 text-gray-700 whitespace-nowrap">
                      {n.lawyer_name || (n.lawyer_id ? `#${n.lawyer_id}` : "—")}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
                          String(n.payment_status || "").toLowerCase() === "paid"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-gray-50 text-gray-700 ring-gray-200",
                        ].join(" ")}
                      >
                        {(n.payment_status || "—").toString().replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className={badge(n.status)}>
                        {(n.status || "—").toString().replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-700 whitespace-nowrap">
                      {formatDate(n.created_at)}
                    </td>

                    <td className="px-6 sm:px-8 py-5 text-right">
                      <Link
                        to={`${role==="admin"?'/admin':''}/notary/${n.notary_id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#142768] shadow-sm hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        View <span className="ml-1">→</span>
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

          {/* bottom padding */}
          <div className="h-2 bg-white" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="text-xs font-semibold text-gray-500">{label}</div>
    <div className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
      {value}
    </div>
    <div className="mt-3 h-px bg-gray-100" />
    <div className="mt-3 text-xs text-gray-500">Updated 3 seconds ago...</div>
  </div>
);

export default NotaryList;