import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyLawyerProfile } from "../../api/lawyersApi";

const pillClass = (ok) =>
  ok
    ? "bg-green-100 text-green-700 border border-green-200"
    : "bg-yellow-100 text-yellow-700 border border-yellow-200";

const safeStr = (v, fallback = "—") => {
  const s = v === null || v === undefined ? "" : String(v);
  return s.trim() ? s : fallback;
};

const parseSpecializations = (raw) => {
  if (Array.isArray(raw)) return raw.filter(Boolean);

  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    try {
      const j = JSON.parse(t);
      if (Array.isArray(j)) return j.filter(Boolean);
    } catch {}
    return t.split(",").map((x) => x.trim()).filter(Boolean);
  }
  return [];
};

const LawyerProfileCard = ({
  updateLink = "/lawyer/profile/edit",
  title = "My Lawyer Profile",
  onLoaded,
}) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const API_SERVER =
    import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000";

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const p = await getMyLawyerProfile();
      setProfile(p || null);
      if (onLoaded) onLoaded(p || null);
    } catch (e) {
      setErr(e?.message || "Failed to load lawyer profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------------- SPECIALIZATION ---------------- */
  const specializations = useMemo(() => {
    const raw = profile?.specialization ?? profile?.specializations;
    return parseSpecializations(raw);
  }, [profile]);

  /* ---------------- LICENSE DOCUMENT URL ---------------- */
  const licenseUrl = useMemo(() => {
    if (!profile?.license_document) return null;

    // If backend returns absolute URL already
    if (String(profile.license_document).startsWith("http"))
      return profile.license_document;

    return `${API_SERVER}/${profile.license_document}`.replace(
      /([^:]\/)\/+/g,
      "$1"
    );
  }, [profile, API_SERVER]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="text-[#142768] font-bold text-lg">{title}</div>
        <div className="mt-3 text-gray-600 text-sm">Loading profile...</div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (err) {
    return (
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[#142768] font-bold text-lg">{title}</div>
            <div className="mt-2 text-sm text-red-600">{err}</div>
          </div>

          <button
            type="button"
            onClick={load}
            className="border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- NO PROFILE ---------------- */
  if (!profile) {
    return (
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[#142768] font-bold text-lg">{title}</div>
            <div className="mt-2 text-sm text-gray-600">
              No profile found for this lawyer account.
            </div>
          </div>

          <Link
            to={updateLink}
            className="bg-[#142768] text-white px-4 py-2 rounded-xl hover:opacity-95 transition text-sm"
          >
            Create / Update Profile
          </Link>
        </div>
      </div>
    );
  }

  const verified = !!profile.is_verified;

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[#142768] font-bold text-lg">{title}</div>

          <div className="mt-3">
            <div className="text-2xl font-bold text-[#142768] truncate">
              {safeStr(profile.full_name, "Unknown Lawyer")}
            </div>

            <div className="mt-1 text-sm text-gray-600">
              {safeStr(profile.email)} • {safeStr(profile.phone)}
            </div>

            <div className="mt-3 inline-flex items-center gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full ${pillClass(
                  verified
                )}`}
              >
                {verified ? "Verified" : "Pending Verification"}
              </span>

              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                Lawyer ID: {safeStr(profile.lawyer_id)}
              </span>
            </div>
          </div>
        </div>

        <Link
          to={updateLink}
          className="border border-[#142768] text-[#142768] px-4 py-2 rounded-xl hover:bg-blue-50 transition text-sm whitespace-nowrap"
        >
          Update Profile
        </Link>
      </div>

      {/* ================= BODY ================= */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* SPECIALIZATION */}
        <div>
          <div className="text-sm text-gray-500">Specialization</div>
          <div className="mt-1 font-semibold text-gray-900">
            {safeStr(
              profile.specialization,
              specializations.length ? "" : "General Practice"
            )}
          </div>

          {specializations.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {specializations.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-1 rounded-full bg-blue-50 text-[#142768] border border-blue-100"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* EXPERIENCE */}
        <div>
          <div className="text-sm text-gray-500">Experience</div>
          <div className="mt-1 font-semibold text-gray-900">
            {Number(profile.experience_years || 0)} years
          </div>
        </div>

        {/* RATE */}
        <div>
          <div className="text-sm text-gray-500">Hourly Rate</div>
          <div className="mt-1 font-semibold text-gray-900">
            Rs. {Number(profile.hourly_rate || 0).toFixed(2)}
          </div>
        </div>

        {/* LICENSE DOCUMENT + PREVIEW */}
        <div>
          <div className="text-sm text-gray-500">License Document</div>

          {licenseUrl ? (
            <div className="mt-2 space-y-2">
              <a
                href={licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[#142768] underline font-semibold"
              >
                Open Document
              </a>

              {/* Preview */}
              {licenseUrl.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={licenseUrl}
                  title="License Preview"
                  className="w-full h-48 border rounded-lg"
                />
              ) : (
                <img
                  src={licenseUrl}
                  alt="License Preview"
                  className="max-h-48 rounded-lg border"
                />
              )}
            </div>
          ) : (
            <div className="mt-1 text-gray-600">Not uploaded</div>
          )}
        </div>

        {/* BIO */}
        <div className="md:col-span-2">
          <div className="text-sm text-gray-500">Bio</div>
          <div className="mt-1 text-gray-700">
            {safeStr(profile.bio, "No bio added yet.")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfileCard;
