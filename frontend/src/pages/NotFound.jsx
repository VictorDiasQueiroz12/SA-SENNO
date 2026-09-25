import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="lv-panel" style={{ textAlign: "center" }}>
      <h1>404</h1>
      <p>Pagina nao encontrada.</p>
      <Link to="/">Voltar ao feed</Link>
    </div>
  );
}
