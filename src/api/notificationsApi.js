import { API_SERVER, http, authHeader } from "./http";

export const unreadCount = () =>
  http(`${API_SERVER}/api/notifications/unread-count`, {
    headers: { ...authHeader() },
  });

export const listNotifications = () =>
  http(`${API_SERVER}/api/notifications`, {
    headers: { ...authHeader() },
  });

export const markRead = (id) =>
  http(`${API_SERVER}/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: { ...authHeader() },
  });

export const markAllRead = () =>
  http(`${API_SERVER}/api/notifications/read-all`, {
    method: "PATCH",
    headers: { ...authHeader() },
  });
