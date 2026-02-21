import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  myAppointments,
  lawyerAccept,
  lawyerOffer,
  lawyerReject,
} from "../../api/appointmentsApi";
import NegotiationChat from "../../components/layout/NegotiationChat";

const FINAL_STATUSES = ["approved", "rejected", "cancelled", "completed"];

const statusPill = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "approved") return "bg-green-100 text-green-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  if (s === "negotiating") return "bg-yellow-100 text-yellow-700";
  if (s === "cancelled") return "bg-gray-100 text-gray-700";
  if (s === "completed") return "bg-indigo-100 text-indigo-700";
  return "bg-blue-100 text-blue-700";
};

const money = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;

const AppointmentDetails = () => {
  const { id } = useParams(); // /lawyer/appointments/:id
  const apptId = Number(id);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [appt, setAppt] = useState(null);
  const [offerFee, setOfferFee] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      // we reuse myAppointments() and pick single appointment
      const list = await myAppointments();
      const found = Array.isArray(list)
        ? list.find((x) => Number(x.appointment_id) === apptId)
        : null;

      if (!found) {
        setAppt(null);
        setErr("Appointment not found or you don't have access.");
      } else {
        setAppt(found);
        setOfferFee(found.offered_fee ?? "");
      }
    } catch (e) {
      setErr(e?.message || "Failed to load appointment");
      setAppt(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apptId]);

  const isFinal = useMemo(() => {
    const s = String(appt?.status || "").toLowerCase();
    return FINAL_STATUSES.includes(s);
  }, [appt?.status]);

  const sendOffer = async () => {
    try {
      setErr("");
      const offered_fee = Number(offerFee);
      if (!Number.isFinite(offered_fee) || offered_fee <= 0) {
        setErr("Please enter a valid offer amount.");
        return;
      }
      await lawyerOffer(apptId, {
        offered_fee,
        negotiation_note: "Fee offer from lawyer",
      });
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to send offer");
    }
  };

  const accept = async () => {
    try {
      setErr("");
      await lawyerAccept(apptId);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to accept");
    }
  };

  const reject = async () => {
    try {
      setErr("");
      await lawyerReject(apptId);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to reject");
    }
  };

  if (loading) return <div className="p-6">Loading appointment...</div>;

  if (!appt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#142768]">Appointment Details</h1>
          <Link
            to="/lawyer/dashboard"
            className="border border-[#142768] text-[#142768] px-4 py-2 rounded-xl hover:bg-blue-50 transition"
          >
            Back
          </Link>
        </div>
        {err ? (
          <div className="mt-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">
            {err}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#142768]">Appointment Details</h1>
          <p className="text-gray-600 mt-2">
            Review request, negotiate fee, and confirm outcome.
          </p>
        </div>

        <Link
          to="/lawyer/dashboard"
          className="border border-[#142768] text-[#142768] px-4 py-2 rounded-xl hover:bg-blue-50 transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {err ? (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">
          {err}
        </div>
      ) : null}

      {/* Appointment Summary */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xl font-bold text-[#142768]">{appt.subject}</div>
            <div className="text-sm text-gray-600 mt-1">
              Client: <span className="font-semibold">{appt.client_name}</span>
            </div>
            <div className="text-sm text-gray-500">
              {appt.appointment_date} • {appt.appointment_time}
            </div>
            {appt.details ? (
              <div className="text-sm text-gray-700 mt-3">{appt.details}</div>
            ) : null}
          </div>

          <div className={`text-xs px-3 py-1 rounded-full ${statusPill(appt.status)}`}>
            {appt.status}
          </div>
        </div>

        {/* Fee Summary */}
        <div className="mt-5 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="border rounded-xl p-3">
            <div className="text-gray-500">Client Proposed</div>
            <div className="font-semibold">{money(appt.proposed_fee)}</div>
          </div>
          <div className="border rounded-xl p-3">
            <div className="text-gray-500">Your Offer</div>
            <div className="font-semibold">{money(appt.offered_fee)}</div>
          </div>
          <div className="border rounded-xl p-3">
            <div className="text-gray-500">Final Fee</div>
            <div className="font-semibold">{money(appt.final_fee)}</div>
          </div>
        </div>

        {/* Negotiation Actions */}
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <input
            className="border rounded-xl px-3 py-2 w-56"
            type="number"
            min="0"
            step="1"
            placeholder="Offer fee (Rs.)"
            value={offerFee}
            onChange={(e) => setOfferFee(e.target.value)}
            disabled={isFinal}
          />

          <button
            onClick={sendOffer}
            className="border border-[#142768] text-[#142768] px-4 py-2 rounded-xl hover:bg-blue-50 transition"
            disabled={isFinal}
          >
            Send Offer
          </button>

          <button
            onClick={accept}
            className="bg-[#142768] text-white px-4 py-2 rounded-xl hover:opacity-95 transition"
            disabled={isFinal}
          >
            Accept
          </button>

          <button
            onClick={reject}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:opacity-95 transition"
            disabled={isFinal}
          >
            Reject
          </button>

          {isFinal ? (
            <div className="text-xs text-gray-500">
              This appointment is finalized. Actions are disabled.
            </div>
          ) : null}
        </div>
      </div>

      {/* Negotiation Chat */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#142768]">Negotiation Chat</h2>
            <p className="text-sm text-gray-600">
              Discuss the case and agree on fees before approval.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <NegotiationChat appointmentId={appt.appointment_id} title="Client ↔ Lawyer Chat" />
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
