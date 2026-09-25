import api from "./api";

export async function likeSighting(sightingId) {
  const { data } = await api.post(`/sightings/${sightingId}/likes`);
  return data;
}

export async function unlikeSighting(sightingId) {
  const { data } = await api.delete(`/sightings/${sightingId}/likes`);
  return data;
}
