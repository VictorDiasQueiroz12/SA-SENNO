import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as notificationsService from "../services/notifications.service";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

const TYPE_ICON = {
  NEW_COMMENT: "💬",
  NEW_LIKE: "❤",
  RELEVANT_SIGHTING: "⚠",
  ADMIN_EVENT: "📢",
};

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsService.listNotifications().then(setItems).finally(() => setLoading(false));
  }, []);

  async function handleMarkAsRead(id) {
    await notificationsService.markNotificationAsRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div>
      <h1>Notificacoes</h1>
      {loading && <LoadingState />}
      {!loading && items.length === 0 && <EmptyState message="Nenhuma notificacao por aqui." />}
      {items.map((n) => (
        <div key={n.id} className="lv-panel" style={{ marginBottom: 8, opacity: n.read ? 0.6 : 1 }}>
          <div className="lv-flex-between">
            <span>{TYPE_ICON[n.type] || "🔔"} {n.message}</span>
            {!n.read && <Button onClick={() => handleMarkAsRead(n.id)}>Marcar como lida</Button>}
          </div>
          {n.referenceId && (
            <Link to={`/avistamentos/${n.referenceId}`} style={{ fontSize: 12 }}>Ver avistamento</Link>
          )}
          <p style={{ fontSize: 11, color: "var(--lv-text-muted)", margin: "4px 0 0" }}>
            {new Date(n.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>
      ))}
    </div>
  );
}
