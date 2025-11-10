import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    {
      name: "copy-manifest",
      closeBundle() {
        // Copy manifest.json from public to dist
        const manifestSrc = resolve(__dirname, "public/manifest.json");
        const manifestDest = resolve(__dirname, "dist/manifest.json");
        fs.copyFileSync(manifestSrc, manifestDest);
        console.log(`✅ Copied: manifest.json`);

        // Copy icons folder if exists
        const iconsDir = resolve(__dirname, "public/icons");
        if (fs.existsSync(iconsDir)) {
          fs.cpSync(iconsDir, resolve(__dirname, "dist/icons"), {
            recursive: true,
          });
          console.log("✅ Copied icons");
        }
      },
    },
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "src/background.ts"),
        content: resolve(__dirname, "src/content.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
