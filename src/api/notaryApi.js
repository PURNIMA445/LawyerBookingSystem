import { API_SERVER, http, authHeader } from "./http";

export const listNotary = () =>
  http(`${API_SERVER}/api/notary`, {
    headers: authHeader(),
  });

export const getNotaryById = (id) =>
  http(`${API_SERVER}/api/notary/${id}`, {
    headers: authHeader(),
  });

/* CLIENT: create (FormData) */
export const createNotary = (formData) =>
  http(`${API_SERVER}/api/notary`, {
    method: "POST",
    headers: {
      ...authHeader(),
      // do NOT set Content-Type for FormData
    },
    body: formData,
  });

/* CLIENT: pay */
export const payNotary = (id, payload = {}) =>
  http(`${API_SERVER}/api/notary/${id}/pay`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

/* LAWYER: upload notarized doc (FormData) */
export const notarizeNotary = (id, formData) =>
  http(`${API_SERVER}/api/notary/${id}/notarize`, {
    method: "PUT",
    headers: {
      ...authHeader(),
      // do NOT set Content-Type for FormData
    },
    body: formData,
  });

/* CLIENT: verify */
export const verifyNotary = (id) =>
  http(`${API_SERVER}/api/notary/${id}/verify`, {
    method: "POST",
    headers: authHeader(),
  });

  export const claimNotary = (id) =>
  http(`${API_SERVER}/api/notary/${id}/claim`, {
    method: "POST",
    headers: authHeader(),
  });
  