import React, { useEffect, useState } from "react";
import { myAppointments, lawyerAccept, lawyerOffer, lawyerReject } from "../../api/appointmentsApi";
import NegotiationChat from "../../components/layout/NegotiationChat";


const LawyerDashboard = () => {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [offerMap, setOfferMap] = useState({});

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const data = await myAppointments();
      setItems(data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendOffer = async (id) => {
    try {
      const offered_fee = offerMap[id];
      await lawyerOffer(id, { offered_fee: Number(offered_fee), negotiation_note: "Fee offer from lawyer" });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const accept = async (id) => {
    try {
      await lawyerAccept(id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const reject = async (id) => {
    try {
      await lawyerReject(id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#142768]">Lawyer Dashboard</h1>
      <p className="text-gray-600 mt-2">Review appointment requests and negotiate fees.</p>

      {err ? <div className="mt-4 text-red-600">{err}</div> : null}

      <div className="mt-8 grid gap-4">
        {items.map((a) => (
          <div key={a.appointment_id} className="bg-white border rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-[#142768]">{a.subject}</div>
                <div className="text-sm text-gray-600">
                  Client: <span className="font-semibold">{a.client_name}</span> • {a.appointment_date} {a.appointment_time}
                </div>
                {a.details ? <div className="text-sm text-gray-700 mt-2">{a.details}</div> : null}
              </div>

              <div className={`text-xs px-3 py-1 rounded-full ${a.status === "approved" ? "bg-green-100 text-green-700" :
                  a.status === "rejected" ? "bg-red-100 text-red-700" :
                    a.status === "negotiating" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                }`}>
                {a.status}
              </div>
            </div>

            <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
              <div className="border rounded-xl p-3">
                <div className="text-gray-500">Client Proposed</div>
                <div className="font-semibold">${Number(a.proposed_fee || 0).toFixed(2)}</div>
              </div>
              <div className="border rounded-xl p-3">
                <div className="text-gray-500">Your Offer</div>
                <div className="font-semibold">${Number(a.offered_fee || 0).toFixed(2)}</div>
              </div>
              <div className="border rounded-xl p-3">
                <div className="text-gray-500">Final Fee</div>
                <div className="font-semibold">${Number(a.final_fee || 0).toFixed(2)}</div>
              </div>
            </div>
            <div className="mt-6">
              <NegotiationChat appointmentId={a.appointment_id} title="Client ↔ Lawyer Chat" />
            </div>


            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <input
                className="border rounded-xl px-3 py-2 w-48"
                type="number"
                min="0"
                step="0.01"
                placeholder="Offer fee"
                value={offerMap[a.appointment_id] ?? (a.offered_fee ?? "")}
                onChange={(e) => setOfferMap((p) => ({ ...p, [a.appointment_id]: e.target.value }))}
                disabled={["approved", "rejected", "cancelled", "completed"].includes(a.status)}
              />
              <button
                onClick={() => sendOffer(a.appointment_id)}
                className="border border-[#142768] text-[#142768] px-4 py-2 rounded-xl hover:bg-blue-50 transition"
                disabled={["approved", "rejected", "cancelled", "completed"].includes(a.status)}
              >
                Send Offer
              </button>

              <button
                onClick={() => accept(a.appointment_id)}
                className="bg-[#142768] text-white px-4 py-2 rounded-xl hover:opacity-95 transition"
                disabled={["approved", "rejected", "cancelled", "completed"].includes(a.status)}
              >
                Accept
              </button>

              <button
                onClick={() => reject(a.appointment_id)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:opacity-95 transition"
                disabled={["approved", "rejected", "cancelled", "completed"].includes(a.status)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {!items.length ? <div className="text-gray-600">No requests yet.</div> : null}
      </div>
    </div>
  );
};

export default LawyerDashboard;
