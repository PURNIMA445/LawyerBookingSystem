import { API_SERVER, http, authHeader } from "./http";

/* =========================
   HELPER → get logged in user id
========================= */
const getAuthUserId = () => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.user?.user_id || parsed?.user_id || null;
  } catch {
    return null;
  }
};

/* =========================
   PROFILE
========================= */

export const getClientProfile = (userId = null) => {
  const id = userId || getAuthUserId();
  return http(`${API_SERVER}/api/clients/profile/${id}`, {
    headers: authHeader(),
  });
};

/* =========================
   CASES
========================= */

export const getClientCases = (userId = null) => {
  const id = userId || getAuthUserId();
  return http(`${API_SERVER}/api/clients/cases/${id}`, {
    headers: authHeader(),
  });
};

/* =========================
   APPOINTMENTS
========================= */

export const getClientAppointments = (userId = null) => {
  const id = userId || getAuthUserId();
  return http(`${API_SERVER}/api/clients/appointments/${id}`, {
    headers: authHeader(),
  });
};

/* =========================
   DOCUMENTS
========================= */

export const getClientDocuments = (userId = null) => {
  const id = userId || getAuthUserId();
  return http(`${API_SERVER}/api/clients/documents/${id}`, {
    headers: authHeader(),
  });
};

/* =========================
   BILLING
========================= */

export const getClientBilling = (userId = null) => {
  const id = userId || getAuthUserId();
  return http(`${API_SERVER}/api/clients/billing/${id}`, {
    headers: authHeader(),
  });
};
