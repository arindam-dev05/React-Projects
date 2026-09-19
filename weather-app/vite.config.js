import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy to a sub-path (e.g. GitHub Pages at /weather-app/),
// add:  base: "/weather-app/"
export default defineConfig({
  plugins: [react()],
});
