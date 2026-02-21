import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listLawyers } from "../api/lawyersApi";

/* ---------------- DUMMY LAWYERS (NEPAL) ---------------- */
const dummyLawyers = [
  {
    lawyer_id: "d1",
    full_name: "Adv. Ramesh Adhikari",
    specialization: "Family Law",
    experience_years: 12,
    hourly_rate: 2500,
    is_verified: 1,
    availability: "unavailable",
  },
  {
    lawyer_id: "d2",
    full_name: "Adv. Sita Koirala",
    specialization: "Criminal Law",
    experience_years: 18,
    hourly_rate: 4000,
    is_verified: 1,
    availability: "unavailable",
  },
  {
    lawyer_id: "d3",
    full_name: "Adv. Bikash Shrestha",
    specialization: "Corporate Law",
    experience_years: 9,
    hourly_rate: 3000,
    is_verified: 1,
    availability: "unavailable",
  },
  {
    lawyer_id: "d4",
    full_name: "Adv. Anjana Thapa",
    specialization: "Property Law",
    experience_years: 15,
    hourly_rate: 3500,
    is_verified: 1,
    availability: "unavailable",
  },
  {
    lawyer_id: "d5",
    full_name: "Adv. Nabin Poudel",
    specialization: "Tax Law",
    experience_years: 22,
    hourly_rate: 5000,
    is_verified: 1,
    availability: "unavailable",
  },
];

export default function Lawyers() {
  const [dbLawyers, setDbLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    experienceMin: 1,
    experienceMax: 40,
    feeMin: "",
    feeMax: "",
    specialization: [],
  });

  /* ---------------- FETCH DB LAWYERS ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await listLawyers();
        const normalized = (data || []).map(l => ({
          ...l,
          availability: "available",
        }));
        setDbLawyers(normalized);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- MERGE DATA ---------------- */
  const allLawyers = useMemo(
    () => [...dbLawyers, ...dummyLawyers],
    [dbLawyers]
  );

  /* ---------------- SPECIALIZATIONS ---------------- */
  const specializations = useMemo(() => {
    const set = new Set();
    allLawyers.forEach(l => l.specialization && set.add(l.specialization));
    return Array.from(set);
  }, [allLawyers]);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredLawyers = useMemo(() => {
    return allLawyers.filter(l => {
      if (!Number(l.is_verified)) return false;

      if (
        l.experience_years < filters.experienceMin ||
        l.experience_years > filters.experienceMax
      ) return false;

      if (filters.feeMin && l.hourly_rate < Number(filters.feeMin)) return false;
      if (filters.feeMax && l.hourly_rate > Number(filters.feeMax)) return false;

      if (
        filters.specialization.length &&
        !filters.specialization.includes(l.specialization)
      ) return false;

      return true;
    });
  }, [allLawyers, filters]);

  const toggleSpec = (spec) => {
    setFilters(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* ---------------- FILTER SIDEBAR ---------------- */}
        <aside className="md:col-span-1 space-y-8">

          <div>
            <h3 className="font-semibold mb-3">Experience (Years)</h3>
            <div className="flex gap-3">
              <input
                type="number"
                min="1"
                max="40"
                value={filters.experienceMin}
                onChange={e =>
                  setFilters(f => ({ ...f, experienceMin: Number(e.target.value) }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                min="1"
                max="40"
                value={filters.experienceMax}
                onChange={e =>
                  setFilters(f => ({ ...f, experienceMax: Number(e.target.value) }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Hourly Rate (Rs.)</h3>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.feeMin}
                onChange={e =>
                  setFilters(f => ({ ...f, feeMin: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.feeMax}
                onChange={e =>
                  setFilters(f => ({ ...f, feeMax: e.target.value }))
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Field of Expertise</h3>
            <div className="space-y-2">
              {specializations.map(spec => (
                <label key={spec} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.specialization.includes(spec)}
                    onChange={() => toggleSpec(spec)}
                  />
                  {spec}
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* ---------------- LAWYER CARDS ---------------- */}
        <section className="md:col-span-3 grid sm:grid-cols-2 gap-5">

          {loading && <p className="text-gray-500">Loading lawyers...</p>}

          {!loading && filteredLawyers.length === 0 && (
            <p className="text-gray-500">No lawyers found.</p>
          )}

          {filteredLawyers.map(l => (
            <div
              key={l.lawyer_id}
              className="bg-white border rounded-2xl  shadow-sm hover:shadow-md transition h-56 p-7"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{l.full_name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    l.availability === "available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {l.availability === "available" ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="text-sm text-gray-600">{l.specialization}</p>
              <p className="text-sm text-gray-600">
                {l.experience_years} years experience
              </p>

              <p className="mt-2 font-medium text-[#142768]">
                Rs. {l.hourly_rate} / hour
              </p>

              <div className="mt-4 flex gap-3">
                <Link
                  to={`/lawyers/${l.lawyer_id}`}
                  className="flex-1 text-center border rounded-lg py-2 text-sm hover:bg-gray-50"
                >
                  View Profile
                </Link>

                {l.availability === "available" ? (
                  <Link
                    to={`/appointments/book/${l.lawyer_id}`}
                    className="flex-1 text-center bg-[#142768] text-white rounded-lg py-2 text-sm hover:opacity-90"
                  >
                    Book
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-200 text-gray-500 rounded-lg py-2 text-sm cursor-not-allowed"
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          ))}

        </section>
      </div>
    </div>
  );
}
