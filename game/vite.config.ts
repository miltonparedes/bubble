import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@bubble/logic": resolve(import.meta.dirname!, "../packages/game-logic/mod.ts"),
      "@bubble/ui": resolve(import.meta.dirname!, "../packages/ui/mod.ts"),
      "@bubble/assets": resolve(import.meta.dirname!, "../packages/assets/mod.ts"),
      "@bubble/db": resolve(import.meta.dirname!, "../packages/db-types/mod.ts"),
      "@": resolve(import.meta.dirname!, "src"),
    },
  },
  server: {
    fs: {
      allow: [
        resolve(import.meta.dirname!, ".."),
      ],
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
