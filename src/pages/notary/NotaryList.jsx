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

  // ✅ more consistent, modern pill styling
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap";

  if (["verified"].includes(s))
    return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
  if (["notarized"].includes(s))
    return `${base} bg-blue-50 text-blue-700 ring-blue-200`;
  if (["paid", "in_review", "submitted"].includes(s))
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

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-48 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-72 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border p-4 bg-gray-50">
              <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
              <div className="mt-2 h-7 w-14 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="mt-6 h-48 rounded-2xl border bg-gray-50 animate-pulse" />
        <div className="mt-3 text-sm text-gray-500">Loading notary requests…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-9 w-9 rounded-xl bg-rose-50 ring-1 ring-rose-200 flex items-center justify-center">
            <span className="text-rose-700 font-bold">!</span>
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-900">Something went wrong</div>
            <div className="mt-1 text-sm text-rose-700">{err}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={load}
                className="inline-flex items-center justify-center rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 active:scale-[0.99]"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/notary/new")}
                className="inline-flex items-center justify-center rounded-xl bg-[#142768] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.99]"
              >
                + New Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-10">
      {/* top header */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-[220px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#142768] ring-1 ring-inset ring-indigo-100">
              Notary Dashboard
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
              Notary Services
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Track notarization requests, payments, and final documents.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={load}
              className="inline-flex items-center justify-center rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 active:scale-[0.99]"
            >
              Refresh
            </button>

            <button
              onClick={() => navigate("/notary/new")}
              className="inline-flex items-center justify-center rounded-xl bg-[#142768] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.99]"
            >
              + New Request
            </button>
          </div>
        </div>

        {/* quick stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={totals.total} />
          <StatCard label="Paid" value={totals.paid} />
          <StatCard label="Notarized" value={totals.notarized} />
          <StatCard label="Verified" value={totals.verified} />
        </div>
      </div>

      {/* table */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b bg-white">
          <div>
            <div className="text-sm font-semibold text-gray-900">Requests</div>
            <div className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{items.length}</span>{" "}
              {items.length === 1 ? "record" : "records"}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Tip: Scroll horizontally on small screens →
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur border-b">
              <tr className="text-xs uppercase tracking-wide text-gray-600">
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Urgency</th>
                <th className="px-4 py-3 text-left font-semibold">Client</th>
                <th className="px-4 py-3 text-left font-semibold">Lawyer</th>
                <th className="px-4 py-3 text-left font-semibold">Payment</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 sm:px-6 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {items.map((n, idx) => (
                <tr
                  key={n.notary_id}
                  className={[
                    "transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/40",
                    "hover:bg-indigo-50/40",
                  ].join(" ")}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="font-semibold text-gray-900 leading-5">
                      {n.title || "—"}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      ID: <span className="font-medium text-gray-700">#{n.notary_id}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
                      {n.doc_type || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={[
                        "inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ring-1 ring-inset",
                        String(n.urgency || "").toLowerCase() === "urgent"
                          ? "bg-rose-50 text-rose-700 ring-rose-200"
                          : String(n.urgency || "").toLowerCase() === "high"
                          ? "bg-amber-50 text-amber-700 ring-amber-200"
                          : "bg-emerald-50 text-emerald-700 ring-emerald-200",
                      ].join(" ")}
                    >
                      {(n.urgency || "—").toString().replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    {n.client_name || n.client_id || "—"}
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    {n.lawyer_name || (n.lawyer_id ? `#${n.lawyer_id}` : "—")}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={[
                        "inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
                        String(n.payment_status || "").toLowerCase() === "paid"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-gray-50 text-gray-700 ring-gray-200",
                      ].join(" ")}
                    >
                      {(n.payment_status || "—").toString().replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className={badge(n.status)}>
                      {(n.status || "—").toString().replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-700">{formatDate(n.created_at)}</td>

                  <td className="px-4 sm:px-6 py-4 text-right">
                    <Link
                      to={`/notary/${n.notary_id}`}
                      className="inline-flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-[#142768] shadow-sm hover:bg-gray-50 active:scale-[0.99]"
                    >
                      View <span className="ml-1">→</span>
                    </Link>
                  </td>
                </tr>
              ))}

              {!items.length ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <div className="mx-auto max-w-md">
                      <div className="text-lg font-semibold text-gray-900">
                        No notary requests found
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Create your first request to start tracking notarization.
                      </div>
                      <div className="mt-5">
                        <button
                          onClick={() => navigate("/notary/new")}
                          className="inline-flex items-center justify-center rounded-xl bg-[#142768] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.99]"
                        >
                          + New Request
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
    {/* subtle top highlight */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-200 via-transparent to-indigo-200 opacity-60" />

    <div className="text-xs font-semibold text-gray-500">{label}</div>
    <div className="mt-1 flex items-baseline gap-2">
      <div className="text-2xl font-extrabold tracking-tight text-gray-900">
        {value}
      </div>
      <div className="text-xs text-gray-400">count</div>
    </div>

    <div className="mt-3 h-px bg-gray-100" />
    <div className="mt-3 text-xs text-gray-500">
      Updated from latest fetch
    </div>
  </div>
);

export default NotaryList;