import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@bubble/logic": resolve(import.meta.dirname!, "../packages/game-logic/mod.ts"),
      "@bubble/ui": resolve(import.meta.dirname!, "../packages/ui/mod.ts"),
      "@bubble/assets": resolve(import.meta.dirname!, "../packages/assets/mod.ts"),
      "@bubble/db": resolve(import.meta.dirname!, "../packages/db-types/mod.ts"),
      "@": resolve(import.meta.dirname!, "src"),
    },
  },
});
