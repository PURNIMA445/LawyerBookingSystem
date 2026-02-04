import { API_SERVER, http } from "./http";

export const listLawyers = () => http(`${API_SERVER}/api/lawyers`);
export const getLawyer = (id) => http(`${API_SERVER}/api/lawyers/${id}`);


export function updateMyLawyerProfile(payload) {
  return http("/api/lawyers/me/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
