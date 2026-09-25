import api from "./api";

export async function reportSighting(sightingId, reason) {
  const { data } = await api.post(`/sightings/${sightingId}/reports`, { reason });
  return data.report;
}

export async function listPendingReports() {
  const { data } = await api.get("/reports");
  return data.reports;
}

export async function updateReportStatus(id, status) {
  const { data } = await api.patch(`/reports/${id}/status`, { status });
  return data.report;
}
