import api from "./api";

export async function listCreatures() {
  const { data } = await api.get("/creatures");
  return data.creatures;
}

export async function getCreatureRanking() {
  const { data } = await api.get("/creatures/ranking");
  return data.ranking;
}
