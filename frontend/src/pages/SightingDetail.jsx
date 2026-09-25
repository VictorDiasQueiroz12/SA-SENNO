import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as sightingsService from "../services/sightings.service";
import * as commentsService from "../services/comments.service";
import * as reportsService from "../services/reports.service";
import MapView from "../components/map/MapView";
import CommentList from "../components/comments/CommentList";
import LikeButton from "../components/sighting/LikeButton";
import DangerBadge from "../components/ui/DangerBadge";
import StatusBadge from "../components/ui/StatusBadge";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import Button from "../components/ui/Button";
import { resolveFileUrl } from "../services/urls";

const STATUS_OPTIONS = ["PENDING", "IN_REVIEW", "VERIFIED", "REJECTED"];

export default function SightingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [sighting, setSighting] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, c] = await Promise.all([
        sightingsService.getSighting(id),
        commentsService.listComments(id),
      ]);
      setSighting(s);
      setComments(c);
    } catch (err) {
      setError(err.response?.status === 404 ? "Avistamento nao encontrado." : "Erro ao carregar avistamento.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function reloadComments() {
    const c = await commentsService.listComments(id);
    setComments(c);
  }

  async function handleDelete() {
    if (!window.confirm("Excluir este avistamento? Essa acao nao pode ser desfeita.")) return;
    try {
      await sightingsService.deleteSighting(id);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Nao foi possivel excluir.");
    }
  }

  async function handleStatusChange(e) {
    const status = e.target.value;
    try {
      const updated = await sightingsService.updateSightingStatus(id, status);
      setSighting(updated);
    } catch (err) {
      alert(err.response?.data?.error || "Nao foi possivel alterar o status.");
    }
  }

  async function handleReport(e) {
    e.preventDefault();
    try {
      await reportsService.reportSighting(id, reportReason);
      setReportMessage("Denuncia registrada. Obrigado por ajudar a manter a comunidade segura.");
      setShowReportForm(false);
      setReportReason("");
    } catch (err) {
      setReportMessage(err.response?.data?.error || "Nao foi possivel registrar a denuncia.");
    }
  }

  if (loading) return <LoadingState label="Carregando avistamento..." />;
  if (error) return <ErrorState message={error} />;
  if (!sighting) return null;

  const isOwner = user?.id === sighting.author?.id;
  const canEdit = isOwner || isAdmin;

  return (
    <div>
      <div className="lv-flex-between">
        <h1>{sighting.creature?.name}</h1>
        <DangerBadge level={sighting.dangerLevel} />
      </div>

      <div className="lv-flex-between" style={{ marginBottom: 12 }}>
        <StatusBadge status={sighting.status} />
        <span style={{ fontSize: 12, color: "var(--lv-text-muted)" }}>
          Por {sighting.author?.name} em {new Date(sighting.occurredAt).toLocaleString("pt-BR")}
        </span>
      </div>

      {sighting.photoUrl && (
        <img src={resolveFileUrl(sighting.photoUrl)} alt={sighting.creature?.name} style={{ maxWidth: "100%", marginBottom: 12, border: "2px solid var(--lv-border-dark)" }} />
      )}

      <p>{sighting.description}</p>
      <p><strong>Local:</strong> {sighting.location}</p>

      <MapView
        center={[sighting.latitude, sighting.longitude]}
        zoom={14}
        markers={[{ id: sighting.id, latitude: sighting.latitude, longitude: sighting.longitude, popup: sighting.location }]}
        height={280}
      />

      <div className="lv-flex-between" style={{ margin: "12px 0" }}>
        <LikeButton sightingId={id} initialCount={sighting.likesCount} initialLiked={sighting.likedByCurrentUser} />

        <div style={{ display: "flex", gap: 6 }}>
          {canEdit && (
            <>
              <Link to={`/avistamentos/${id}/editar`}><Button>Editar</Button></Link>
              <Button variant="danger" onClick={handleDelete}>Excluir</Button>
            </>
          )}
          {isAuthenticated && !isOwner && (
            <Button onClick={() => setShowReportForm((v) => !v)}>Denunciar</Button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="lv-field" style={{ maxWidth: 260 }}>
          <label className="lv-label">Status (moderacao)</label>
          <select className="lv-select" value={sighting.status} onChange={handleStatusChange}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      {showReportForm && (
        <form onSubmit={handleReport} className="lv-panel" style={{ marginBottom: 12 }}>
          <label className="lv-label">Motivo da denuncia</label>
          <textarea className="lv-textarea" required value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Descreva o motivo da denuncia..." />
          <Button type="submit" variant="primary" style={{ marginTop: 6 }}>Enviar denuncia</Button>
        </form>
      )}
      {reportMessage && <p>{reportMessage}</p>}

      <hr />
      <CommentList sightingId={id} comments={comments} onChange={reloadComments} />
    </div>
  );
}
