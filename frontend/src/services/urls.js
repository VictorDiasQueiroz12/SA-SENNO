// Resolve URLs relativas de arquivos servidos pelo backend (ex: uploads locais)
// em URLs absolutas, ja que frontend e backend estao em origens diferentes.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api";
const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function resolveFileUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path; // ja e absoluta (ex: storage externo em producao)
  return `${BACKEND_ORIGIN}${path}`;
}
