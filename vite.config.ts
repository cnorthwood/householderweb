import react from "@vitejs/plugin-react";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [postcssPresetEnv({ browsers: "defaults" })],
    },
  },
  resolve: {
    alias: [
      { find: "~bulma", replacement: "bulma" },
      { find: "xlsx-populate", replacement: "xlsx-populate/browser/xlsx-populate" },
    ],
  },
});
