import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getAppointmentById,
  lawyerAccept,
  lawyerOffer,
  lawyerReject,
} from "../../api/appointmentsApi";
import NegotiationChat from "../../components/layout/NegotiationChat";

const money = (n) => `Rs. ${Number(n || 0).toFixed(2)}`;

const AppointmentDetails = () => {
  const { id } = useParams();
  const apptId = Number(id);

  const [appt, setAppt] = useState(null);
  const [offerFee, setOfferFee] = useState("");
  const [file, setFile] = useState(null);

  const load = async () => {
    const res = await getAppointmentById(apptId);
    setAppt(res.appointment);
    setOfferFee(res.appointment?.offered_fee || "");
  };

  useEffect(() => {
    load();
  }, [apptId]);

  const phase = useMemo(() => {
    if (!appt) return "loading";
    if (["pending", "negotiating"].includes(appt.status)) return "negotiation";
    if (appt.status === "awaiting_payment") return "payment";
    if (["approved", "completed", "paid"].includes(appt.status)) return "case";
    return "final";
  }, [appt]);

  const canOffer = appt?.last_offered_by !== "lawyer";
  const canAccept = appt?.last_offered_by === "client";

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

  const upload = async () => {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("appointment_id", apptId);
    fd.append("message_type", "document");

    await fetch("/api/messages/upload", {
      method: "POST",
      body: fd,
    });

    setFile(null);
    load();
  };

  if (!appt) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-[#142768]">Appointment Details</h1>
        <Link to="/lawyer/dashboard">Back</Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold">{appt.subject}</h2>
        <p>{appt.client.name}</p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>Proposed: {money(appt.proposed_fee)}</div>
          <div>Offer: {money(appt.offered_fee)}</div>
          <div>Final: {money(appt.final_fee)}</div>
        </div>
      </div>

      {phase === "negotiation" && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex gap-3">
            <input
              type="number"
              value={offerFee}
              onChange={(e) => setOfferFee(e.target.value)}
              className="border px-3 py-2 rounded-xl"
            />

            {canOffer && (
              <button onClick={sendOffer} className="btn">
                Offer
              </button>
            )}

            {canAccept && (
              <button onClick={accept} className="btn bg-green-600 text-white">
                Accept
              </button>
            )}

            <button onClick={reject} className="btn bg-red-600 text-white">
              Reject
            </button>
          </div>
        </div>
      )}

      {phase === "case" && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">

          {/* Chat only after approval */}
          <NegotiationChat appointmentId={apptId} status={appt.status} />
          {
            appt.status !== "completed" &&
            <div>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={upload} className="ml-3 px-4 py-2 bg-[#142768] text-white rounded-xl">
                Upload
              </button>
            </div>

          }
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;