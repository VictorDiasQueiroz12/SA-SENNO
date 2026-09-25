import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPendingReports, updateReportStatus } from "../../services/reports.service";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    listPendingReports().then(setReports).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleAction(id, status) {
    await updateReportStatus(id, status);
    load();
  }

  return (
    <div>
      <h1>Denuncias pendentes</h1>
      {loading && <LoadingState />}
      {!loading && reports.length === 0 && <EmptyState message="Nenhuma denuncia pendente." />}
      {reports.map((r) => (
        <div key={r.id} className="lv-panel" style={{ marginBottom: 8 }}>
          <p><strong>Denunciado por:</strong> {r.user?.name}</p>
          <p><strong>Motivo:</strong> {r.reason}</p>
          <p><strong>Avistamento:</strong> <Link to={`/avistamentos/${r.sighting?.id}`}>{r.sighting?.location}</Link></p>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <Button onClick={() => handleAction(r.id, "RESOLVED")}>Resolver</Button>
            <Button onClick={() => handleAction(r.id, "DISMISSED")}>Descartar</Button>
            <Button onClick={() => handleAction(r.id, "IN_REVIEW")}>Marcar em analise</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
