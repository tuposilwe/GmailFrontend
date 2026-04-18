import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/auth":       { target: "http://localhost:8000", changeOrigin: true },
      "/emails":     { target: "http://localhost:8000", changeOrigin: true },
      "/send-email": { target: "http://localhost:8000", changeOrigin: true },
      "/contacts":   { target: "http://localhost:8000", changeOrigin: true },
      "/storage":    { target: "http://localhost:8000", changeOrigin: true },
      "/logo":       { target: "http://localhost:8000", changeOrigin: true },
      "/signatures": { target: "http://localhost:8000", changeOrigin: true },
      "/labels":     { target: "http://localhost:8000", changeOrigin: true },
      "/snooze":     { target: "http://localhost:8000", changeOrigin: true },
      "/debug":      { target: "http://localhost:8000", changeOrigin: true },
      "/mail-events": {
        target: "ws://localhost:8000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
