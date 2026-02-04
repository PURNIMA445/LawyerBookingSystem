import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLawyer } from "../api/lawyersApi";
import { createAppointment } from "../api/appointmentsApi";

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const q = new URLSearchParams(location.search);
  const lawyerId = q.get("lawyerId");

  const [lawyer, setLawyer] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [appointment_date, setDate] = useState("");
  const [appointment_time, setTime] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [proposed_fee, setProposedFee] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!lawyerId) throw new Error("Missing lawyerId");
        const data = await getLawyer(lawyerId);
        setLawyer(data);
        setProposedFee(String(Number(data.hourly_rate || 0)));
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [lawyerId]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await createAppointment({
        lawyer_id: Number(lawyerId),
        appointment_date,
        appointment_time,
        subject,
        details,
        proposed_fee: proposed_fee === "" ? null : Number(proposed_fee),
      });

      navigate("/profile");
    } catch (e2) {
      setErr(e2.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!lawyer) return <div className="p-6">Lawyer not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#142768]">Request Appointment</h1>
        <p className="text-gray-600 mt-1">
          With <span className="font-semibold">{lawyer.full_name}</span> ({lawyer.specialization || "General"})
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input className="w-full mt-1 border rounded-xl px-3 py-2" type="date" value={appointment_date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input className="w-full mt-1 border rounded-xl px-3 py-2" type="time" value={appointment_time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <input className="w-full mt-1 border rounded-xl px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Details</label>
            <textarea className="w-full mt-1 border rounded-xl px-3 py-2 min-h-[120px]" value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Proposed Fee (per hour)</label>
              <input className="w-full mt-1 border rounded-xl px-3 py-2" type="number" min="0" step="0.01" value={proposed_fee} onChange={(e) => setProposedFee(e.target.value)} />
              <p className="text-xs text-gray-500 mt-1">Lawyer default rate: ${Number(lawyer.hourly_rate || 0).toFixed(2)}/hr</p>
            </div>
          </div>

          {err ? <div className="text-sm text-red-600">{err}</div> : null}

          <button className="bg-[#142768] text-white px-5 py-3 rounded-xl hover:opacity-95 transition">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
