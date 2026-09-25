import { useEffect, useState } from "react";
import { getCreatureRanking } from "../services/creatures.service";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreatureRanking()
      .then(setRanking)
      .catch(() => setError("Ranking indisponivel no momento."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (ranking.length === 0) return <EmptyState message="Ainda nao ha avistamentos verificados para ranquear." />;

  return (
    <div>
      <h1>Criaturas mais avistadas</h1>
      <ol>
        {ranking.map((c) => (
          <li key={c.creatureId} style={{ marginBottom: 6 }}>
            <strong>{c.name}</strong> — {c.count} avistamento(s) ({c.percentage}%)
          </li>
        ))}
      </ol>
    </div>
  );
}
