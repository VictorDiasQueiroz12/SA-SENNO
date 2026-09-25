const LABELS = {
  PENDING: "Pendente",
  IN_REVIEW: "Em analise",
  VERIFIED: "Verificado",
  REJECTED: "Rejeitado",
};

export default function StatusBadge({ status }) {
  return <span className="lv-status-badge">{LABELS[status] || status}</span>;
}
