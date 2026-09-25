import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listSightings } from "../services/sightings.service";
import SightingCard from "../components/sighting/SightingCard";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Window from "../components/ui/Window";

export default function Profile() {
  const { user } = useAuth();
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSightings({ mine: "true", pageSize: 50 })
      .then((data) => setMine(data.items))
      .finally(() => setLoading(false));
  }, []);

  const likesReceived = mine.reduce((sum, s) => sum + (s.likesCount || 0), 0);

  return (
    <div>
      <Window title="Meu perfil" icon="👤">
        <p><strong>Nome:</strong> {user?.name}</p>
        <p><strong>Membro desde:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"}</p>
        <p><strong>Avistamentos registrados:</strong> {mine.length}</p>
        <p><strong>Curtidas recebidas:</strong> {likesReceived}</p>
      </Window>

      <h2 style={{ marginTop: 20 }}>Meus avistamentos</h2>
      {loading && <LoadingState />}
      {!loading && mine.length === 0 && <EmptyState message="Voce ainda nao registrou nenhum avistamento." />}
      {!loading && mine.length > 0 && (
        <div className="lv-grid">
          {mine.map((s) => <SightingCard key={s.id} sighting={s} />)}
        </div>
      )}
    </div>
  );
}
