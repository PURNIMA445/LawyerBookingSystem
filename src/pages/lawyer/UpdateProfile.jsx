import React, { useEffect, useMemo, useState } from "react";
import { getMyLawyerProfile, updateMyLawyerProfile } from "../../api/lawyersApi";
import { Link, useNavigate } from "react-router-dom";

const isEmail = (v) => /\S+@\S+\.\S+/.test(String(v || "").trim());

const UpdateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    specialization: "",
    experience_years: "",
    hourly_rate: "",
    bio: "",
  });

  const [licenseFile, setLicenseFile] = useState(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState(null);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const API_SERVER =
    import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000";

  const load = async () => {
    setErr("");
    const p = await getMyLawyerProfile();
    setProfile(p);
    setForm({
      specialization: p?.specialization || "",
      experience_years: p?.experience_years ?? "",
      hourly_rate: p?.hourly_rate ?? "",
      bio: p?.bio || "",
    });
  };

  useEffect(() => {
    load();
  }, []);

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    };
  }, [newPreviewUrl]);

  const existingDocUrl = useMemo(() => {
    if (!profile?.license_document) return null;
    if (String(profile.license_document).startsWith("http")) return profile.license_document;
    return `${API_SERVER}/${profile.license_document}`.replace(/([^:]\/)\/+/g, "$1");
  }, [profile, API_SERVER]);

  const validate = () => {
    const e = {};

    if (!String(form.specialization || "").trim()) {
      e.specialization = "Specialization is required";
    }

    const yrs = Number(form.experience_years);
    if (Number.isNaN(yrs) || yrs < 0 || yrs > 40) {
      e.experience_years = "Experience must be between 0 and 40 years";
    }

    const rate = Number(form.hourly_rate);
    if (Number.isNaN(rate) || rate < 0) {
      e.hourly_rate = "Hourly rate must be a valid number";
    }

    if (String(form.bio || "").trim().length > 2000) {
      e.bio = "Bio is too long (max 2000 chars)";
    }

    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setLicenseFile(f);

    if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    setNewPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");

    if (!validate()) return;

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("specialization", form.specialization);
      fd.append("experience_years", String(form.experience_years));
      fd.append("hourly_rate", String(form.hourly_rate));
      fd.append("bio", form.bio || "");

      // must match backend multer field name
      if (licenseFile) fd.append("license_document", licenseFile);

      await updateMyLawyerProfile(fd);

      navigate("/lawyer/dashboard");
    } catch (ex) {
      setErr(ex.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-[#142768]">Update Profile</h1>
          <p className="text-gray-600">Update your professional details and upload documents.</p>
        </div>

        <Link
          to="/lawyer/dashboard"
          className="border border-[#142768] text-[#142768] px-4 py-2 rounded-xl hover:bg-blue-50 transition"
        >
          Back
        </Link>
      </div>

      {err ? <div className="text-red-600">{err}</div> : null}

      <form onSubmit={save} className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
        {/* Specialization */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Specialization <span className="text-red-500">*</span>
          </label>
          <input
            className={`border rounded-xl px-3 py-2 w-full ${
              fieldErrors.specialization ? "border-red-300" : "border-gray-200"
            }`}
            value={form.specialization}
            onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
            placeholder="e.g., Land & Property Law"
          />
          {fieldErrors.specialization ? (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.specialization}</p>
          ) : null}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Experience Years (0–40) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="40"
            className={`border rounded-xl px-3 py-2 w-full ${
              fieldErrors.experience_years ? "border-red-300" : "border-gray-200"
            }`}
            value={form.experience_years}
            onChange={(e) => setForm((p) => ({ ...p, experience_years: e.target.value }))}
          />
          {fieldErrors.experience_years ? (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.experience_years}</p>
          ) : null}
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Hourly Rate (Rs.) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="1"
            className={`border rounded-xl px-3 py-2 w-full ${
              fieldErrors.hourly_rate ? "border-red-300" : "border-gray-200"
            }`}
            value={form.hourly_rate}
            onChange={(e) => setForm((p) => ({ ...p, hourly_rate: e.target.value }))}
            placeholder="e.g., 1500"
          />
          {fieldErrors.hourly_rate ? (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.hourly_rate}</p>
          ) : null}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Bio</label>
          <textarea
            rows={5}
            className={`border rounded-xl px-3 py-2 w-full ${
              fieldErrors.bio ? "border-red-300" : "border-gray-200"
            }`}
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Write a short professional bio..."
          />
          {fieldErrors.bio ? <p className="text-sm text-red-600 mt-1">{fieldErrors.bio}</p> : null}
        </div>

        {/* License Document + Previews */}
        <div className="space-y-3">
          <label className="block text-sm text-gray-600 mb-1">
            License Document (PDF / Image)
          </label>

          {/* ✅ EXISTING DOCUMENT PREVIEW */}
          {existingDocUrl ? (
            <div className="border rounded-xl p-3">
              <div className="text-sm text-gray-500 mb-2">Current Document</div>

              {String(existingDocUrl).toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={existingDocUrl}
                  title="Current License Document"
                  className="w-full h-64 rounded-lg border"
                />
              ) : (
                <img
                  src={existingDocUrl}
                  alt="Current License Document"
                  className="max-h-72 rounded-lg border"
                />
              )}

              <a
                href={existingDocUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-[#142768] underline text-sm"
              >
                Open in new tab
              </a>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No license document uploaded yet.</div>
          )}

          {/* ✅ NEW FILE PREVIEW */}
          {newPreviewUrl ? (
            <div className="border rounded-xl p-3">
              <div className="text-sm text-gray-500 mb-2">New Document Preview</div>

              {licenseFile?.type === "application/pdf" ? (
                <iframe
                  src={newPreviewUrl}
                  title="New License Document"
                  className="w-full h-64 rounded-lg border"
                />
              ) : (
                <img
                  src={newPreviewUrl}
                  alt="New License Preview"
                  className="max-h-72 rounded-lg border"
                />
              )}

              <div className="text-xs text-gray-500 mt-2">
                Selected: <span className="font-medium">{licenseFile?.name}</span>
              </div>
            </div>
          ) : null}

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileChange}
            className="block"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#142768] text-white px-6 py-2 rounded-xl hover:opacity-95 transition disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
