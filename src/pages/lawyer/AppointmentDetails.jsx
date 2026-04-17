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

const money = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;

const AppointmentDetails = () => {
  const { id } = useParams();
  const apptId = Number(id);

  const [appt, setAppt] = useState(null);
  const [offerFee, setOfferFee] = useState("");
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");

  const load = async () => {
    const list = await myAppointments();
    const found = list.find(x => Number(x.appointment_id) === apptId);
    setAppt(found);
    setOfferFee(found?.offered_fee ?? "");
  };

  useEffect(() => {
    load();
  }, [apptId]);

  const isFinal = useMemo(() => {
    return FINAL_STATUSES.includes(appt?.status);
  }, [appt]);

  const isPaid = useMemo(() => {
    return ["paid", "completed"].includes(appt?.status);
  }, [appt]);

  const sendOffer = async () => {
    await lawyerOffer(apptId, { offered_fee: Number(offerFee) });
    load();
  };

  const accept = async () => {
    await lawyerAccept(apptId);
    load();
  };

  const reject = async () => {
    await lawyerReject(apptId);
    load();
  };

  /* ================= FILE UPLOAD ================= */
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointment_id", apptId);

    try {
      // 👉 replace with your API
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      alert("Document uploaded");
      setFile(null);
    } catch (e) {
      alert("Upload failed");
    }
  };

  if (!appt) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-[#142768]">
          Appointment Details
        </h1>
        <Link to="/lawyer/dashboard">Back</Link>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold">{appt.subject}</h2>
        <p>{appt.client_name}</p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>Proposed: {money(appt.proposed_fee)}</div>
          <div>Offer: {money(appt.offered_fee)}</div>
          <div>Final: {money(appt.final_fee)}</div>
        </div>
      </div>

      {/* ================= NEGOTIATION ================= */}
      {!isPaid && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-3">Negotiation Panel</h2>

          {!isFinal && (
            <div className="flex gap-3">
              <input
                type="number"
                value={offerFee}
                onChange={(e) => setOfferFee(e.target.value)}
                className="border px-3 py-2 rounded-xl"
              />

              <button onClick={sendOffer} className="btn">
                Send Offer
              </button>

              <button onClick={accept} className="btn bg-green-600 text-white">
                Accept
              </button>

              <button onClick={reject} className="btn bg-red-600 text-white">
                Reject
              </button>
            </div>
          )}

          {/* negotiation chat */}
          <div className="mt-4">
            <NegotiationChat appointmentId={apptId} />
          </div>
        </div>
      )}

      {/* ================= POST PAYMENT CHAT ================= */}
      {isPaid && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-bold mb-3">
            Case Discussion
          </h2>

          {/* Chat */}
          <NegotiationChat appointmentId={apptId} />

          {/* File Upload */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Upload Documents</h3>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button
              onClick={handleUpload}
              className="ml-3 px-4 py-2 bg-[#142768] text-white rounded-xl"
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;