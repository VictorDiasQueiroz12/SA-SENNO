import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../ui/Button";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="lv-navbar">
      <Link to="/" className="lv-navbar-brand">
        <span>🐾</span>
        <span>Little Ville — Registro de Avistamentos</span>
      </Link>

      <nav className="lv-navbar-links">
        <Link to="/"><Button>Feed</Button></Link>
        <Link to="/mapa"><Button>Mapa</Button></Link>
        <Link to="/ranking"><Button>Ranking</Button></Link>

        {isAuthenticated ? (
          <>
            <Link to="/avistamentos/novo"><Button variant="primary">+ Avistamento</Button></Link>
            <Link to="/notificacoes"><Button>Notificacoes</Button></Link>
            <Link to="/perfil"><Button>{user?.name?.split(" ")[0] || "Perfil"}</Button></Link>
            {isAdmin && <Link to="/admin"><Button>Admin</Button></Link>}
            <Button onClick={handleLogout}>Sair</Button>
          </>
        ) : (
          <>
            <Link to="/login"><Button>Entrar</Button></Link>
            <Link to="/cadastro"><Button variant="primary">Cadastrar</Button></Link>
          </>
        )}

        <Button onClick={toggleTheme} title="Alternar tema">
          {theme === "light" ? "🌙" : "☀"}
        </Button>
      </nav>
    </header>
  );
}
