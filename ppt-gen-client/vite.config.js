import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src", // This maps `@` to the `src` directory
    },
  },
  server: {
    host: "0.0.0.0", // Allows external access
    port: 5173,
  },
});
