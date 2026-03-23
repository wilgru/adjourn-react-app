import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      external: ["better-sqlite3"],
    },
  },
  // build: {
  //   outDir: ".vite/dist",
  // rollupOptions: {
  //   output: {
  //     format: "es",
  //     entryFileNames: "[name].mjs",
  //     chunkFileNames: "[name]-[hash].mjs",
  //   },
  // },
  //   lib: {
  //     entry: "electron/main.ts",
  //     formats: ["cjs"],
  //     fileName: () => "main.cjs",
  //   },
  //   target: "node16",
  //   minify: false,
  // },
});
