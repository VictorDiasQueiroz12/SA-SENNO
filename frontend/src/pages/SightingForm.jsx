import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as sightingsService from "../services/sightings.service";
import * as uploadsService from "../services/uploads.service";
import { listCreatures } from "../services/creatures.service";
import MapView from "../components/map/MapView";
import Window from "../components/ui/Window";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import { resolveFileUrl } from "../services/urls";

const DANGER_LEVELS = ["LOW", "MODERATE", "HIGH", "CRITICAL"];

const emptyForm = {
  creatureName: "",
  location: "",
  latitude: null,
  longitude: null,
  occurredAtDate: "",
  occurredAtTime: "",
  description: "",
  dangerLevel: "LOW",
  photoUrl: "",
};

export default function SightingForm() {
  const { id } = useParams(); // presente apenas em modo edicao
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [creatures, setCreatures] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    listCreatures().then(setCreatures).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    sightingsService.getSighting(id).then((s) => {
      const occurredAt = new Date(s.occurredAt);
      setForm({
        creatureName: s.creature?.name || "",
        location: s.location,
        latitude: s.latitude,
        longitude: s.longitude,
        occurredAtDate: occurredAt.toISOString().slice(0, 10),
        occurredAtTime: occurredAt.toISOString().slice(11, 16),
        description: s.description,
        dangerLevel: s.dangerLevel,
        photoUrl: s.photoUrl || "",
      });
    }).finally(() => setLoading(false));
  }, [id, isEditing]);

  function handleMapClick(latlng) {
    setForm((f) => ({ ...f, latitude: latlng.lat, longitude: latlng.lng }));
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocalizacao nao suportada neste navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => setError("Nao foi possivel obter sua localizacao.")
    );
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const photoUrl = await uploadsService.uploadPhoto(file);
      setForm((f) => ({ ...f, photoUrl }));
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.latitude == null || form.longitude == null) {
      setError("Marque a localizacao no mapa ou use sua localizacao atual.");
      return;
    }

    const occurredAt = new Date(`${form.occurredAtDate}T${form.occurredAtTime || "00:00"}:00`);

    const payload = {
      creatureName: form.creatureName,
      location: form.location,
      latitude: form.latitude,
      longitude: form.longitude,
      occurredAt: occurredAt.toISOString(),
      description: form.description,
      dangerLevel: form.dangerLevel,
      photoUrl: form.photoUrl || undefined,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await sightingsService.updateSighting(id, payload);
        navigate(`/avistamentos/${id}`);
      } else {
        const created = await sightingsService.createSighting(payload);
        navigate(`/avistamentos/${created.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel salvar o avistamento.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <Window title={isEditing ? "Editar avistamento" : "Novo avistamento"} icon="👣">
      <form onSubmit={handleSubmit}>
        <Field label="Criatura">
          <input
            className="lv-input"
            list="creatures-list"
            required
            value={form.creatureName}
            onChange={(e) => setForm({ ...form, creatureName: e.target.value })}
            placeholder="Ex: Pe Grande, ou digite uma nova"
          />
          <datalist id="creatures-list">
            {creatures.map((c) => <option key={c.id} value={c.name} />)}
          </datalist>
        </Field>

        <Field label="Local (descricao)">
          <input
            className="lv-input"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Ex: Trilha do Morro da Lagoa"
          />
        </Field>

        <Field label="Localizacao no mapa">
          <MapView
            onMapClick={handleMapClick}
            markers={form.latitude ? [{ id: "novo", latitude: form.latitude, longitude: form.longitude }] : []}
            height={280}
          />
          <Button type="button" onClick={handleUseMyLocation} style={{ marginTop: 6 }}>
            📍 Usar minha localizacao atual
          </Button>
          {form.latitude != null && (
            <p style={{ fontSize: 12, color: "var(--lv-text-muted)" }}>
              Lat: {form.latitude.toFixed(5)} / Lng: {form.longitude.toFixed(5)}
            </p>
          )}
        </Field>

        <Field label="Data e hora do avistamento">
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="lv-input"
              type="date"
              required
              value={form.occurredAtDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setForm({ ...form, occurredAtDate: e.target.value })}
            />
            <input
              className="lv-input"
              type="time"
              required
              value={form.occurredAtTime}
              onChange={(e) => setForm({ ...form, occurredAtTime: e.target.value })}
            />
          </div>
        </Field>

        <Field label="Descricao">
          <textarea
            className="lv-textarea"
            required
            minLength={10}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <Field label="Nivel de perigo">
          <select
            className="lv-select"
            value={form.dangerLevel}
            onChange={(e) => setForm({ ...form, dangerLevel: e.target.value })}
          >
            {DANGER_LEVELS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        <Field label="Foto (opcional)">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
          {uploading && <p>Enviando foto...</p>}
          {form.photoUrl && (
            <img src={resolveFileUrl(form.photoUrl)} alt="preview" style={{ maxWidth: 200, marginTop: 6, border: "2px solid var(--lv-border-dark)" }} />
          )}
        </Field>

        {error && <p className="lv-error-text">{error}</p>}

        <Button type="submit" variant="primary" disabled={submitting || uploading}>
          {submitting ? "Salvando..." : isEditing ? "Salvar alteracoes" : "Registrar avistamento"}
        </Button>
      </form>
    </Window>
  );
}
