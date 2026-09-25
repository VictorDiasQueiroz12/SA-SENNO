const LABELS = { LOW: "🟢 Baixo", MODERATE: "🟡 Moderado", HIGH: "🟠 Alto", CRITICAL: "🔴 Critico" };

export default function DangerBadge({ level }) {
  return <span className={`lv-badge lv-badge-${level}`}>{LABELS[level] || level}</span>;
}
