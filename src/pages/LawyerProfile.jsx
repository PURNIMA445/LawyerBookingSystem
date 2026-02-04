import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getLawyer } from "../api/lawyersApi";

const useQuery = () => new URLSearchParams(useLocation().search);

const LawyerProfile = () => {
  const q = useQuery();
  const lawyerId = q.get("lawyerId");
  const [lawyer, setLawyer] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!lawyerId) throw new Error("Missing lawyerId");
        const data = await getLawyer(lawyerId);
        setLawyer(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [lawyerId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!lawyer) return <div className="p-6">Not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#142768]">{lawyer.full_name}</h1>
            <p className="text-gray-600 mt-1">{lawyer.specialization || "General Practice"}</p>
          </div>
          <div className={`text-xs px-3 py-1 rounded-full ${lawyer.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {lawyer.is_verified ? "Verified" : "Unverified"}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm text-gray-700">
          <div><span className="font-semibold">Experience:</span> {lawyer.experience_years || 0} years</div>
          <div><span className="font-semibold">Hourly Rate:</span> ${Number(lawyer.hourly_rate || 0).toFixed(2)}/hr</div>
          <div><span className="font-semibold">Email:</span> {lawyer.email}</div>
          <div><span className="font-semibold">Phone:</span> {lawyer.phone || "-"}</div>
        </div>

        <div className="mt-6">
          <div className="font-semibold text-[#142768]">About</div>
          <p className="text-gray-600 mt-2">{lawyer.bio || "No bio available."}</p>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            to={`/bookappointment?lawyerId=${lawyer.lawyer_id}`}
            className="bg-[#142768] text-white px-5 py-3 rounded-xl hover:opacity-95 transition"
          >
            Request Appointment
          </Link>
          <Link
            to="/lawyers"
            className="border border-[#142768] text-[#142768] px-5 py-3 rounded-xl hover:bg-blue-50 transition"
          >
            Back to Lawyers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;
