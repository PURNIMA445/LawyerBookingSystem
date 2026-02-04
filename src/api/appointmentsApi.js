import { API_SERVER, http, authHeader } from "./http";

export const createAppointment = (payload) =>
  http(`${API_SERVER}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });

export const myAppointments = () =>
  http(`${API_SERVER}/api/appointments/my`, { headers: { ...authHeader() } });

export const lawyerOffer = (id, payload) =>
  http(`${API_SERVER}/api/appointments/${id}/offer`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });

export const lawyerAccept = (id) =>
  http(`${API_SERVER}/api/appointments/${id}/accept`, {
    method: "PATCH",
    headers: { ...authHeader() },
  });

export const lawyerReject = (id) =>
  http(`${API_SERVER}/api/appointments/${id}/reject`, {
    method: "PATCH",
    headers: { ...authHeader() },
  });

export const clientCounter = (id, payload) =>
  http(`${API_SERVER}/api/appointments/${id}/counter`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload),
  });

export const clientConfirm = (id) =>
  http(`${API_SERVER}/api/appointments/${id}/confirm`, {
    method: "PATCH",
    headers: { ...authHeader() },
  });
