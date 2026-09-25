import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listSightings } from "../services/sightings.service";
import MapView from "../components/map/MapView";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";

export default function MapExplorer() {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listSightings({ pageSize: 50 })
      .then((data) => setSightings(data.items))
      .catch(() => setError("Nao foi possivel carregar o mapa de avistamentos."))
      .finally(() => setLoading(false));
  }, []);

  const markers = sightings.map((s) => ({
    id: s.id,
    latitude: s.latitude,
    longitude: s.longitude,
    popup: (
      <div>
        <strong>{s.creature?.name}</strong>
        <p style={{ margin: "4px 0" }}>{s.location}</p>
        <Link to={`/avistamentos/${s.id}`}>Ver detalhes</Link>
      </div>
    ),
  }));

  return (
    <div>
      <h1>Mapa de avistamentos</h1>
      {loading && <LoadingState label="Carregando mapa..." />}
      {error && <ErrorState message={error} />}
      {!loading && !error && <MapView markers={markers} height={520} />}
    </div>
  );
}
