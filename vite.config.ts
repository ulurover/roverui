import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["ulurover.jpeg", "masked-icon.svg"],
      manifest: {
        name: "Ulurover UI",
        short_name: "Ulurover UI",
        description: "The app for Ulurover Communication",
        theme_color: "#464646",
        icons: [
          {
            src: "icon-96-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
