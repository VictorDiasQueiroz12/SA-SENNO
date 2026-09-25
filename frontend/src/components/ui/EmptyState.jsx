export default function EmptyState({ message = "Nada por aqui ainda." }) {
  return <div className="lv-empty-state">🗒 {message}</div>;
}
