import api from "./api";

export async function listNotifications() {
  const { data } = await api.get("/notifications");
  return data.notifications;
}

export async function markNotificationAsRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data.notification;
}
