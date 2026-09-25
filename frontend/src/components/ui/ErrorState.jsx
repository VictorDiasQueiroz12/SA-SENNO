export default function ErrorState({ message = "Algo deu errado." }) {
  return <div className="lv-error-state">⚠ {message}</div>;
}
