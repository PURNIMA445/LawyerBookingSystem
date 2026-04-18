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

  
  import axios from "axios";


const getToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.token;
};

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/* ================= GET BY ID ================= */
export const getAppointmentById = async (id) => {
  try {
    const res = await axios.get(`${API_SERVER}/api/appointments/${id}`, config());
    return res.data;
  } catch (e) {
    return { error: e.response?.data?.error || "Failed to fetch appointment" };
  }
};

/* ================= COMPLETE ================= */
export const completeAppointment = async (id, data) => {
  try {
    const res = await axios.patch(`${API_SERVER}/api/appointments/${id}/complete`, data, config());
    return res.data;
  } catch (e) {
    return { error: e.response?.data?.error || "Failed to complete appointment" };
  }
};