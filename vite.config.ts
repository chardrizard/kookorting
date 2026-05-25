/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/kookorting/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    process.env.VITE_COMPONENT_TAGGER !== 'false' &&
    componentTagger(),
  ].filter(Boolean),
  optimizeDeps: {
    noDiscovery: process.env.VITE_SKIP_DEP_SCAN === 'true',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
