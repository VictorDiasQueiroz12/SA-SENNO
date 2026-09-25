import { useEffect, useState, useCallback } from "react";
import { listSightings } from "../services/sightings.service";
import { listCreatures } from "../services/creatures.service";
import SightingCard from "../components/sighting/SightingCard";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

const DANGER_LEVELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"];

export default function Feed() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [creatures, setCreatures] = useState([]);
  const [filters, setFilters] = useState({ search: "", creature: "", dangerLevel: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, pageSize: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.creature) params.creature = filters.creature;
      if (filters.dangerLevel) params.dangerLevel = filters.dangerLevel;
      const data = await listSightings(params);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError("Nao foi possivel carregar os avistamentos.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    listCreatures().then(setCreatures).catch(() => {});
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  return (
    <div>
      <h1>Avistamentos recentes</h1>

      <div className="lv-filters">
        <input
          className="lv-input"
          placeholder="Buscar por descricao ou local..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="lv-select"
          value={filters.creature}
          onChange={(e) => setFilters({ ...filters, creature: e.target.value })}
        >
          <option value="">Todas as criaturas</option>
          {creatures.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          className="lv-select"
          value={filters.dangerLevel}
          onChange={(e) => setFilters({ ...filters, dangerLevel: e.target.value })}
        >
          <option value="">Todos os niveis</option>
          {DANGER_LEVELS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading && <LoadingState label="Carregando avistamentos..." />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && items.length === 0 && <EmptyState message="Nenhum avistamento verificado ainda." />}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="lv-grid">
            {items.map((s) => <SightingCard key={s.id} sighting={s} />)}
          </div>
          <div className="lv-flex-between" style={{ marginTop: 16 }}>
            <Button disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)}>
              ← Anterior
            </Button>
            <span>Pagina {pagination.page} de {pagination.totalPages}</span>
            <Button disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1)}>
              Proxima →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
