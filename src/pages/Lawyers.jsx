import React, { useEffect, useState } from "react";
import { listLawyers } from "../api/lawyersApi";
import { Link } from "react-router-dom";

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listLawyers();
        setLawyers(data || []);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading lawyers...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#142768]">Lawyers</h1>
      <p className="text-gray-600 mt-2">Browse verified and experienced lawyers and request an appointment.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {lawyers.map((l) => (
          <div key={l.lawyer_id} className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-[#142768]">{l.full_name}</div>
                <div className="text-sm text-gray-600">{l.specialization || "General Practice"}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${l.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {l.is_verified ? "Verified" : "Unverified"}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <div><span className="font-semibold">Experience:</span> {l.experience_years || 0} years</div>
              <div><span className="font-semibold">Rate:</span> ${Number(l.hourly_rate || 0).toFixed(2)}/hr</div>
            </div>

            <p className="mt-4 text-sm text-gray-600">{l.bio || "No bio available."}</p>

            <div className="mt-5 flex gap-3">
              <Link
                to={`/lawyerprofile?lawyerId=${l.lawyer_id}`}
                className="flex-1 text-center border border-[#142768] text-[#142768] py-2 rounded-xl hover:bg-blue-50 transition"
              >
                View Details
              </Link>
              <Link
                to={`/bookappointment?lawyerId=${l.lawyer_id}`}
                className="flex-1 text-center bg-[#142768] text-white py-2 rounded-xl hover:opacity-95 transition"
              >
                Book
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lawyers;
