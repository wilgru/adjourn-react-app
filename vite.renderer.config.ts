import { resolve } from "path";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// https://github.com/cheriot/electron-tanstack-demo/tree/master/desktop/src
export default defineConfig({
  base: "/",
  plugins: [
    tanstackStart(),
    react(),
    nitro({ preset: "bun", output: { dir: ".vite/dist" } }),
  ],
  environments: {
    ssr: { build: { rollupOptions: { input: "./src/server.ts" } } },
  },
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
    },
  },
});
