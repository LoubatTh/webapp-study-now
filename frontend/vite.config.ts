import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/vitest/setupTests.ts",
    include: [
      "./tests/vitest/**/*.test.js",
      "./tests/vitest/**/*.test.jsx",
      "./tests/vitest/**/*.test.ts",
      "./tests/vitest/**/*.test.tsx",
    ],
    exclude: ["./tests/playwright/**"],
  },
  server: {
    host: true,
    port: 3000,
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
