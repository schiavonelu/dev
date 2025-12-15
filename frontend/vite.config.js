import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // opzionale
  const target = env.VITE_API_URL || "http://localhost:8080"; // usato solo dal proxy

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,            // Codespaces
      port: 5173,
      hmr: { clientPort: 443 },
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});



