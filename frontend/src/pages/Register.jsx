import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Window from "../components/ui/Window";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel criar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "0 auto" }}>
      <Window title="Criar conta" icon="📝">
        <form onSubmit={handleSubmit}>
          <Field label="Nome">
            <input
              className="lv-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="E-mail">
            <input
              className="lv-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Senha" error={form.password && form.password.length < 6 ? "Minimo de 6 caracteres." : null}>
            <input
              className="lv-input"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          {error && <p className="lv-error-text">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>
        <p style={{ marginTop: 12 }}>
          Ja tem conta? <Link to="/login">Entrar</Link>
        </p>
      </Window>
    </div>
  );
}
