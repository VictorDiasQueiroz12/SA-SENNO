import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuracao padrao do Vite + plugin do React.
// Nao precisamos de proxy de dev aqui porque o backend ja tem CORS
// configurado (FRONTEND_URL no .env do backend).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
