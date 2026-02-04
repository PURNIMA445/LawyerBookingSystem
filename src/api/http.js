export const API_SERVER = import.meta.env.VITE_API_SERVER_URL || "http://localhost:5000";

export const authHeader = () => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return {};
    return { Authorization: `Bearer ${parsed.token}` };
  } catch {
    return {};
  }
};

export async function http(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}
