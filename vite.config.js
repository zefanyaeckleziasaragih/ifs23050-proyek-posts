import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/", // 🟢 penting: pastikan path build benar di Vercel
    build: {
      outDir: "dist", // folder hasil build
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // 🟢 supaya import "@/..." bisa dipakai
      },
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(env.VITE_DELCOM_BASEURL || ""),
    },
  };
});
