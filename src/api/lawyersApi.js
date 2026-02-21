import { API_SERVER, http, authHeader } from "./http";

/* =====================================================
   PUBLIC
===================================================== */

// list all lawyers
export const listLawyers = () =>
  http(`${API_SERVER}/api/lawyers`);

// public profile by id
export const getLawyer = (id) =>
  http(`${API_SERVER}/api/lawyers/${id}`);

/* =====================================================
   LAWYER — SELF ONLY
===================================================== */

// profile (GET /api/lawyers/me)
export const getMyLawyerProfile = () =>
  http(`${API_SERVER}/api/lawyers/me`, {
    headers: authHeader(),
  });

// update profile (PUT /api/lawyers/me)
export const updateMyLawyerProfile = (formData) =>
  http(`${API_SERVER}/api/lawyers/me`, {
    method: "PUT",
    headers: {
      ...authHeader(),
      // DO NOT set Content-Type for FormData
    },
    body: formData,
  });

// dashboard bundle (overview + stats + appointments + cases + docs)
export const getMyLawyerDashboard = (id) =>
  http(`${API_SERVER}/api/lawyers/${id}/dashboard`, {
    headers: authHeader(),
  });

/* =====================================================
   ADMIN — LAWYER MANAGEMENT
===================================================== */

// list all lawyers (admin panel)
export const adminListLawyers = () =>
  http(`${API_SERVER}/api/admin/lawyers`, {
    headers: authHeader(),
  });

// full dashboard of a specific lawyer
export const adminGetLawyerDashboard = (lawyerId) =>
  http(`${API_SERVER}/api/admin/lawyers/${lawyerId}/dashboard`, {
    headers: authHeader(),
  });