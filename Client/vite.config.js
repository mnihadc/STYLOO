import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true, // Add this
        secure: false,
        ws: true, // Optional: for WebSocket support
      },
    },
  },
  plugins: [react(), tailwindcss()],
});
