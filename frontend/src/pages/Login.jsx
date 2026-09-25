import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Window from "../components/ui/Window";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form);
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel entrar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "0 auto" }}>
      <Window title="Login" icon="🔑">
        <form onSubmit={handleSubmit}>
          <Field label="E-mail">
            <input
              className="lv-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Senha">
            <input
              className="lv-input"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          {error && <p className="lv-error-text">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p style={{ marginTop: 12 }}>
          Nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </Window>
    </div>
  );
}
