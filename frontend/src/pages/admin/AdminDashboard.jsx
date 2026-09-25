import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getDashboardStats } from "../../services/dashboard.service";
import LoadingState from "../../components/ui/LoadingState";
import ErrorState from "../../components/ui/ErrorState";
import Window from "../../components/ui/Window";
import Button from "../../components/ui/Button";

const COLORS = ["#000080", "#1084d0", "#808080", "#c0c0c0", "#d2691e"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError("Nao foi possivel carregar o dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="lv-flex-between">
        <h1>Dashboard administrativo</h1>
        <Link to="/admin/denuncias"><Button>Ver denuncias</Button></Link>
      </div>

      <div className="lv-grid" style={{ marginBottom: 16 }}>
        <div className="lv-panel"><strong>Usuarios</strong><p style={{ fontSize: 24 }}>{stats.totalUsers}</p></div>
        <div className="lv-panel"><strong>Avistamentos</strong><p style={{ fontSize: 24 }}>{stats.totalSightings}</p></div>
        <div className="lv-panel"><strong>Denuncias pendentes</strong><p style={{ fontSize: 24 }}>{stats.pendingReports}</p></div>
      </div>

      <Window title="Avistamentos por nivel de perigo" icon="📊">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.byDangerLevel.map((d) => ({ name: d.dangerLevel, total: d.count }))}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#1084d0" />
          </BarChart>
        </ResponsiveContainer>
      </Window>

      <Window title="Avistamentos por status" icon="📈">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={stats.byStatus.map((s) => ({ name: s.status, value: s.count }))}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {stats.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Window>

      <Window title="Criaturas mais registradas" icon="🐾">
        <ol>
          {stats.topCreatures.map((c) => (
            <li key={c.creatureId}>{c.name} — {c.count}</li>
          ))}
        </ol>
      </Window>
    </div>
  );
}
