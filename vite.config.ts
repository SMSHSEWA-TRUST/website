import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/screens": path.resolve(__dirname, "./src/screens"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});
