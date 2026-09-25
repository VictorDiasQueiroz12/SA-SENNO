import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingState from "../components/ui/LoadingState";

// IMPORTANTE (reforcando a decisao da defesa): isto e so conveniencia de UX.
// Esconder/redirecionar aqui NAO substitui a seguranca real, que esta no
// backend (auth.middleware + authorize.middleware + verificacao de
// propriedade do recurso). Qualquer pessoa pode chamar a API diretamente
// sem passar por esta tela.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingState label="Verificando sessao..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
