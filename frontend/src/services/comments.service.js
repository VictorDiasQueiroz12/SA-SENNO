import api from "./api";

export async function listComments(sightingId) {
  const { data } = await api.get(`/sightings/${sightingId}/comments`);
  return data.comments;
}

export async function createComment(sightingId, content) {
  const { data } = await api.post(`/sightings/${sightingId}/comments`, { content });
  return data.comment;
}

export async function updateComment(id, content) {
  const { data } = await api.put(`/comments/${id}`, { content });
  return data.comment;
}

export async function deleteComment(id) {
  const { data } = await api.delete(`/comments/${id}`);
  return data;
}
