import { API_SERVER, http, authHeader } from "./http";

/* USERS */
export const getUsers = () =>
  http(`${API_SERVER}/api/admin/users`, {
    headers: authHeader(),
  });

export const verifyUser = (id) =>
  http(`${API_SERVER}/api/admin/users/${id}/verify`, {
    method: "PUT",
    headers: authHeader(),
  });

export const getAdmins = () =>
  http(`${API_SERVER}/api/admin/admins`, {
    headers: authHeader(),
  });

/* LAWYERS */
export const getLawyersAdmin = () =>
  http(`${API_SERVER}/api/admin/lawyers`, {
    headers: authHeader(),
  });

export const verifyLawyer = (id) =>
  http(`${API_SERVER}/api/admin/lawyers/${id}/verify`, {
    method: "PUT",
    headers: authHeader(),
  });

/* APPOINTMENTS */
export const getAppointmentsAdmin = () =>
  http(`${API_SERVER}/api/admin/appointments`, {
    headers: authHeader(),
  });

export const cancelAppointment = (id) =>
  http(`${API_SERVER}/api/admin/appointments/${id}/cancel`, {
    method: "PUT",
    headers: authHeader(),
  });


export const getAdminLawyerProfile = (lawyerId) =>
  http(`${API_SERVER}/api/admin/lawyers/${lawyerId}/profile`, {
    headers: authHeader(),
  });