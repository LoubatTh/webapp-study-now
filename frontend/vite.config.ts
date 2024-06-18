import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["./tests/vitest/*.test.js"],
    exclude: ["./tests/playwright/**"],
  },
  server: {
    host: true,
    port: 8000,
    proxy: {
      "/api": "http://backend",
    },
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
