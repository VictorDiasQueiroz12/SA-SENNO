import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Correcao necessaria: o bundler (Vite) nao resolve os caminhos padrao dos
// icones do Leaflet automaticamente - sem isso, os marcadores aparecem quebrados.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl, shadowUrl });

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e.latlng);
    },
  });
  return null;
}

// Componente de mapa reutilizavel - usado tanto no explorador publico
// quanto no formulario de criacao/edicao (para marcar um ponto).
export default function MapView({
  center = [-27.5954, -48.548], // Florianopolis, apenas como centro padrao
  zoom = 12,
  markers = [],
  onMapClick,
  height = 400,
}) {
  return (
    <div style={{ height, border: "2px solid var(--lv-border-dark)" }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onMapClick && <ClickHandler onMapClick={onMapClick} />}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.latitude, m.longitude]}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
