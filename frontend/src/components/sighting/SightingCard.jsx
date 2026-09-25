import { Link } from "react-router-dom";
import DangerBadge from "../ui/DangerBadge";
import StatusBadge from "../ui/StatusBadge";
import { resolveFileUrl } from "../../services/urls";

export default function SightingCard({ sighting }) {
  return (
    <div className="lv-panel">
      {sighting.photoUrl && (
        <img
          src={resolveFileUrl(sighting.photoUrl)}
          alt={sighting.creature?.name}
          style={{ width: "100%", height: 140, objectFit: "cover", marginBottom: 8, border: "2px solid var(--lv-border-dark)" }}
        />
      )}
      <div className="lv-flex-between">
        <strong>{sighting.creature?.name}</strong>
        <DangerBadge level={sighting.dangerLevel} />
      </div>
      <p style={{ margin: "6px 0", fontSize: 12, color: "var(--lv-text-muted)" }}>
        📍 {sighting.location}
      </p>
      <p style={{ margin: "6px 0" }}>
        {sighting.description?.slice(0, 120)}
        {sighting.description?.length > 120 ? "..." : ""}
      </p>
      <div className="lv-flex-between">
        <StatusBadge status={sighting.status} />
        <Link to={`/avistamentos/${sighting.id}`}>
          <button className="lv-btn">Ver mais</button>
        </Link>
      </div>
    </div>
  );
}
