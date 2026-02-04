import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLawyerById } from "../api/lawyersApi";

const API_URL = import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000";

const LawyerDetails = () => {
  const { lawyerId } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchLawyerById(lawyerId)
      .then((data) => {
        if (!active) return;
        setLawyer(data);
        setError("");
      })
      .catch((e) => active && setError(e.message || "Failed to load lawyer"))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [lawyerId]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if (!lawyer) return <div className="max-w-4xl mx-auto px-4 py-10">Not found</div>;

  const specs = Array.isArray(lawyer.specializations) ? lawyer.specializations : [];
  const normalizedDoc = lawyer.license_document
    ? String(lawyer.license_document).replace(/\\/g, "/")
    : "";
  const docUrl = normalizedDoc
    ? normalizedDoc.startsWith("uploads/")
      ? `${API_URL}/${normalizedDoc}`
      : normalizedDoc.startsWith("/uploads/")
        ? `${API_URL}${normalizedDoc}`
        : `${API_URL}/uploads/${normalizedDoc.replace(/^\//, "")}`
    : "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{lawyer.full_name}</h1>
          <p className="text-gray-600">{lawyer.law_firm}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {specs.map((s, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 rounded-full text-sm">{s}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/lawyers" className="border rounded-lg px-4 py-2 hover:bg-gray-50">Back</Link>
          <Link to={`/bookappointment?lawyer_id=${lawyer.lawyer_id}`} className="bg-black text-white rounded-lg px-4 py-2 hover:opacity-90">Book Appointment</Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border rounded-xl p-5 bg-white">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-2 text-gray-700 whitespace-pre-line">{lawyer.bio || "No bio provided yet."}</p>
        </div>
        <div className="border rounded-xl p-5 bg-white space-y-2">
          <div className="text-sm text-gray-600">Experience</div>
          <div className="text-lg font-semibold">{lawyer.years_of_experience}</div>

          {lawyer.hourly_rate !== null && lawyer.hourly_rate !== undefined && (
            <>
              <div className="text-sm text-gray-600 mt-4">Hourly rate</div>
              <div className="text-lg font-semibold">${lawyer.hourly_rate}/hr</div>
            </>
          )}

          {docUrl && (
            <a className="inline-block mt-4 text-sm underline" href={docUrl} target="_blank" rel="noreferrer">
              View License Document
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerDetails;
