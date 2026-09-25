import api from "./api";

export async function listSightings(params = {}) {
  const { data } = await api.get("/sightings", { params });
  return data;
}

export async function getSighting(id) {
  const { data } = await api.get(`/sightings/${id}`);
  return data.sighting;
}

export async function createSighting(payload) {
  const { data } = await api.post("/sightings", payload);
  return data.sighting;
}

export async function updateSighting(id, payload) {
  const { data } = await api.put(`/sightings/${id}`, payload);
  return data.sighting;
}

export async function deleteSighting(id) {
  const { data } = await api.delete(`/sightings/${id}`);
  return data;
}

export async function updateSightingStatus(id, status) {
  const { data } = await api.patch(`/sightings/${id}/status`, { status });
  return data.sighting;
}
