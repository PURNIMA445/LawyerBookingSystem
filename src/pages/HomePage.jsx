import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listLawyers } from "../api/lawyersApi";

const dummyLawyers = [
  {
    id: "d1",
    name: "Adv. Sushil Koirala",
    specialization: "Corporate & Company Law",
    experience: "16 years",
    availability: "Busy",
  },
  {
    id: "d2",
    name: "Adv. Rina Shrestha",
    specialization: "Family & Divorce Law",
    experience: "11 years",
    availability: "Busy",
  },
  {
    id: "d3",
    name: "Adv. Prakash Adhikari",
    specialization: "Criminal Defense",
    experience: "14 years",
    availability: "Busy",
  },
  {
    id: "d4",
    name: "Adv. Anil Thapa",
    specialization: "Land & Property Law",
    experience: "19 years",
    availability: "Busy",
  },
  {
    id: "d5",
    name: "Adv. Nirmala Gurung",
    specialization: "Labor & Employment Law",
    experience: "9 years",
    availability: "Busy",
  },
  {
    id: "d6",
    name: "Adv. Bikash Poudel",
    specialization: "Banking & Financial Law",
    experience: "13 years",
    availability: "Busy",
  },
];

const normalizeDbLawyer = (l) => {
  const years = Number(l?.experience_years ?? 0);
  const spec =
    Array.isArray(l?.specialization)
      ? l.specialization.join(", ")
      : (l?.specialization || "General Practice");

  return {
    id: l?.lawyer_id, // numeric id from DB
    lawyer_id: l?.lawyer_id,
    name: l?.full_name || "Unknown Lawyer",
    specialization: spec,
    experience: `${years} years`,
    availability: "Available",
    hourly_rate: l?.hourly_rate ?? 0,
    is_verified: !!l?.is_verified,
    bio: l?.bio || "",
    source: "db",
  };
};

const normalizeDummyLawyer = (l) => ({
  id: l.id, // string id for dummy
  lawyer_id: null,
  name: l.name,
  specialization: l.specialization,
  experience: l.experience,
  availability: l.availability,
  hourly_rate: null,
  is_verified: false,
  bio: "",
  source: "dummy",
});

const keyOf = (l) =>
  `${String(l.name).toLowerCase().trim()}|${String(l.specialization).toLowerCase().trim()}`;

const Lawyers = () => {
  const [dbLawyers, setDbLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await listLawyers();
        const normalized = Array.isArray(data) ? data.map(normalizeDbLawyer) : [];
        setDbLawyers(normalized);
      } catch (e) {
        setErr(e?.message || "Failed to load lawyers");
        setDbLawyers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mergedLawyers = useMemo(() => {
    const dummy = dummyLawyers.map(normalizeDummyLawyer);

    // merge + de-duplicate (prefer DB record)
    const map = new Map();

    for (const l of dummy) map.set(keyOf(l), l);
    for (const l of dbLawyers) map.set(keyOf(l), l);

    return Array.from(map.values());
  }, [dbLawyers]);

  if (loading) return <div className="p-6">Loading lawyers...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#142768]">Lawyers</h1>
          <p className="text-gray-600 mt-2">
            Browse lawyers and request an appointment.
          </p>
        </div>

        {err ? (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-xl">
            {err} (showing dummy list)
          </div>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {mergedLawyers.map((l) => {
          const isDb = l.source === "db";
          const canView = isDb && l.lawyer_id;
          const canBook = isDb && l.lawyer_id;

          return (
            <div key={String(l.id)} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-bold text-[#142768] truncate">
                    {l.name}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {l.specialization}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      l.availability === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {l.availability}
                  </div>

                  {isDb ? (
                    <div
                      className={`text-[11px] px-2 py-1 rounded-full ${
                        l.is_verified ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {l.is_verified ? "Verified" : "Unverified"}
                    </div>
                  ) : (
                    <div className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Dummy
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Experience:</span> {l.experience}
                </div>

                {isDb ? (
                  <div className="mt-1">
                    <span className="font-semibold">Rate:</span>{" "}
                    ${Number(l.hourly_rate || 0).toFixed(2)}/hr
                  </div>
                ) : null}
              </div>

              {isDb && l.bio ? (
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">{l.bio}</p>
              ) : (
                <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                  {isDb ? "No bio available." : "This profile is placeholder dummy data."}
                </p>
              )}

              <div className="mt-5 flex gap-3">
                {canView ? (
                  <Link
                    to={`/lawyerprofile?lawyerId=${l.lawyer_id}`}
                    className="flex-1 text-center border border-[#142768] text-[#142768] py-2 rounded-xl hover:bg-blue-50 transition"
                  >
                    View Details
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="flex-1 text-center border border-gray-300 text-gray-500 py-2 rounded-xl cursor-not-allowed"
                    disabled
                  >
                    View Details
                  </button>
                )}

                {canBook ? (
                  <Link
                    to={`/bookappointment?lawyerId=${l.lawyer_id}`}
                    className="flex-1 text-center bg-[#142768] text-white py-2 rounded-xl hover:opacity-95 transition"
                  >
                    Book
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="flex-1 text-center bg-gray-200 text-gray-600 py-2 rounded-xl cursor-not-allowed"
                    disabled
                    title="Dummy profiles cannot be booked"
                  >
                    Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!mergedLawyers.length ? (
        <div className="mt-10 text-gray-600">No lawyers found.</div>
      ) : null}
    </div>
  );
};

export default Lawyers;
