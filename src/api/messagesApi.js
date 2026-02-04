import { API_SERVER, http, authHeader } from "./http";

export const getMessages = (appointmentId) =>
  http(`${API_SERVER}/api/appointments/${appointmentId}/messages`, {
    headers: { ...authHeader() },
  });

export const sendMessage = (appointmentId, message) =>
  http(`${API_SERVER}/api/appointments/${appointmentId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ message }),
  });
