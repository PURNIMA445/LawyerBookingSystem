import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listLawyers } from "../api/lawyersApi";


const dummyLawyers = [
  {
    id: "d1",
    name: "Adv. Sushil Koirala",
    specialization: "Corporate & Company Law",
    experience_years: 16,
  },
  {
    id: "d2",
    name: "Adv. Rina Shrestha",
    specialization: "Family & Divorce Law",
    experience_years: 11,
  },
  {
    id: "d3",
    name: "Adv. Prakash Adhikari",
    specialization: "Criminal Defense",
    experience_years: 14,
  },
  {
    id: "d4",
    name: "Adv. Anil Thapa",
    specialization: "Land & Property Law",
    experience_years: 19,
  },
];


const normalizeDbLawyer = (l) => ({
  id: l.lawyer_id,
  lawyer_id: l.lawyer_id,
  name: l.full_name,
  specialization: l.specialization || "General Practice",
  experience: `${l.experience_years || 0} years`,
  hourly_rate: l.hourly_rate,
  is_verified: Boolean(l.is_verified),
  bio: l.bio || "",
  available: true,
});

const normalizeDummyLawyer = (l) => ({
  id: l.id,
  lawyer_id: null,
  name: l.name,
  specialization: l.specialization,
  experience: `${l.experience_years} years`,
  hourly_rate: null,
  is_verified: false,
  bio: "",
  available: false,
});


const Lawyers = () => {
  const [dbLawyers, setDbLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listLawyers();
        const normalized = Array.isArray(data)
          ? data.map(normalizeDbLawyer)
          : [];
        setDbLawyers(normalized);
      } catch (e) {
        setError("Could not load lawyers from server");
        setDbLawyers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const lawyers = useMemo(() => {
    if (dbLawyers.length) return dbLawyers;
    return dummyLawyers.map(normalizeDummyLawyer);
  }, [dbLawyers]);

  if (loading) {
    return <div className="p-8 text-gray-600">Loading lawyers...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#142768]">Lawyers</h1>
        <p className="text-gray-600 mt-2">
          Browse verified lawyers and request an appointment.
        </p>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
            {error} — showing limited list
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map((l) => (
          <div
            key={l.id}
            className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#142768]">
                  {l.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {l.specialization}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  l.is_verified
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {l.is_verified ? "Verified" : "Unverified"}
              </span>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              <div>
                <strong>Experience:</strong> {l.experience}
              </div>

              {l.hourly_rate !== null && (
                <div className="mt-1">
                  <strong>Rate:</strong> Rs.{l.hourly_rate}/hr
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-600 line-clamp-3">
              {l.bio || "No bio available."}
            </p>

            <div className="mt-6 flex gap-3">
              {l.available ? (
                <>
                  <Link
                    to={`/lawyerprofile?lawyerId=${l.lawyer_id}`}
                    className="flex-1 text-center border border-[#142768] text-[#142768] py-2 rounded-xl hover:bg-blue-50 transition"
                  >
                    View Profile
                  </Link>

                  <Link
                    to={`/bookappointment?lawyerId=${l.lawyer_id}`}
                    className="flex-1 text-center bg-[#142768] text-white py-2 rounded-xl hover:opacity-95 transition"
                  >
                    Book
                  </Link>
                </>
              ) : (
                <>
                  <button
                    disabled
                    className="flex-1 border border-gray-300 text-gray-400 py-2 rounded-xl cursor-not-allowed"
                  >
                    View Profile
                  </button>

                  <button
                    disabled
                    className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-xl cursor-not-allowed"
                  >
                    Book
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {!lawyers.length && (
        <div className="mt-10 text-gray-600">No lawyers found.</div>
      )}
    </div>
  );
};

export default Lawyers;
