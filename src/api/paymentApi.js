import { API_SERVER, http, authHeader } from "./http";

export const initiateEsewa = (notary_id) =>
  http(`${API_SERVER}/api/payment/esewa/initiate`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notary_id }),
  });