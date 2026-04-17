import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listLawyers } from "../api/lawyersApi";

export default function Lawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    experienceMin: 0,
    experienceMax: 50,
    rateMin: "",
    rateMax: "",
    specialization: [],
    sortBy: "name",
    sortOrder: "asc",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await listLawyers();
        const arr = Array.isArray(data)
          ? data
          : data?.lawyers || data?.data || [];

        const normalized = arr.map(l => ({
          lawyer_id: l.lawyer_id || l._id,
          full_name: l.full_name || "",
          specialization: Array.isArray(l.specialization)
            ? l.specialization
            : [l.specialization],
          experience_years: Number(l.experience_years) || 0,
          hourly_rate: Number(l.hourly_rate) || 0,
          availability: l.availability || "available",
        }));

        setLawyers(normalized);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const specializations = useMemo(() => {
    const set = new Set();
    lawyers.forEach(l =>
      l.specialization.forEach(s => s && set.add(s))
    );
    return Array.from(set);
  }, [lawyers]);

  const filtered = useMemo(() => {
    let result = [...lawyers];

    if (filters.search) {
      result = result.filter(l =>
        l.full_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    result = result.filter(l =>
      l.experience_years >= filters.experienceMin &&
      l.experience_years <= filters.experienceMax
    );

    if (filters.rateMin)
      result = result.filter(l => l.hourly_rate >= Number(filters.rateMin));

    if (filters.rateMax)
      result = result.filter(l => l.hourly_rate <= Number(filters.rateMax));

    if (filters.specialization.length) {
      result = result.filter(l =>
        l.specialization.some(s =>
          filters.specialization.includes(s)
        )
      );
    }

    result.sort((a, b) => {
      let valA, valB;

      if (filters.sortBy === "name") {
        valA = a.full_name.toLowerCase();
        valB = b.full_name.toLowerCase();
      } else if (filters.sortBy === "experience") {
        valA = a.experience_years;
        valB = b.experience_years;
      } else {
        valA = a.hourly_rate;
        valB = b.hourly_rate;
      }

      if (valA < valB) return filters.sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return filters.sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [lawyers, filters]);

  const toggleSpec = (spec) => {
    setFilters(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">

        {/* SIDEBAR */}
        <aside className="space-y-6 sticky top-2/12 h-fit bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-slate-200">

          <input
            type="text"
            placeholder="🔍 Search lawyers..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#142768] outline-none"
          />

          <div>
            <h3 className="font-semibold mb-2 text-slate-700">Experience</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.experienceMin}
                onChange={e => setFilters(f => ({ ...f, experienceMin: Number(e.target.value) }))}
                className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.experienceMax}
                onChange={e => setFilters(f => ({ ...f, experienceMax: Number(e.target.value) }))}
                className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-slate-700">Rate (Rs)</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.rateMin}
                onChange={e => setFilters(f => ({ ...f, rateMin: e.target.value }))}
                className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.rateMax}
                onChange={e => setFilters(f => ({ ...f, rateMax: e.target.value }))}
                className="w-full border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-slate-700">Specialization</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {specializations.map(spec => (
                <label key={spec} className="flex gap-2 text-sm cursor-pointer hover:text-blue-600">
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

        {/* RESULTS */}
        <section className="md:col-span-3">

          {/* SORT BAR */}
          <div className="flex justify-end gap-3 mb-6">
            <select
              value={filters.sortBy}
              onChange={e =>
                setFilters(f => ({
                  ...f,
                  sortBy: e.target.value,
                  sortOrder: "asc",
                }))
              }
              className="border rounded-xl px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#142768]"
            >
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="rate">Rate</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={e => setFilters(f => ({ ...f, sortOrder: e.target.value }))}
              className="border rounded-xl px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#142768]"
            >
              {filters.sortBy === "name" ? (
                <>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </>
              ) : (
                <>
                  <option value="asc">Lowest First</option>
                  <option value="desc">Highest First</option>
                </>
              )}
            </select>
          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {loading && <p className="text-gray-500">Loading...</p>}
            {!loading && filtered.length === 0 && <p>No lawyers found</p>}

            {filtered.map(l => (
              <div
                key={l.lawyer_id}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[240px]"
              >

                <div>
                  <h3 className="font-semibold text-lg text-slate-800 group-hover:text-[#142768] transition">
                    {l.full_name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {l.specialization.join(", ")}
                  </p>

                  <p className="text-sm mt-2 text-slate-600">
                    {l.experience_years} yrs experience
                  </p>

                  <p className="font-semibold mt-3 text-[#142768] text-lg">
                    Rs. {l.hourly_rate}
                    <span className="text-sm font-normal text-slate-500"> / hour</span>
                  </p>
                </div>

                <div className="flex gap-2 mt-5">
                  <Link
                    to={`/lawyers/${l.lawyer_id}`}
                    className="flex-1 text-center border border-slate-300 rounded-lg py-2 text-sm hover:bg-slate-50 transition"
                  >
                    Profile
                  </Link>

                  <Link
                    to={`/appointments/book/${l.lawyer_id}`}
                    className="flex-1 text-center bg-[#142768] text-white rounded-lg py-2 text-sm hover:bg-[#0f1d52] transition"
                  >
                    Book
                  </Link>
                </div>

              </div>
            ))}

          </div>
        </section>
      </div>
    </div>
  );
}