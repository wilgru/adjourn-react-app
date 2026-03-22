import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: ".vite/dist",
    rollupOptions: {
      output: {
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name]-[hash].cjs",
        format: "cjs",
      },
    },
    lib: {
      entry: "electron/main.ts",
      formats: ["cjs"],
      fileName: () => "main.cjs",
    },
    target: "node16",
    minify: false,
  },
});
