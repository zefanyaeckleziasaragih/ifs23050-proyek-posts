import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/", // ⬅️ wajib agar asset di-load dari root
    build: { outDir: "dist" },
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    define: {
      DELCOM_BASEURL: JSON.stringify(env.VITE_DELCOM_BASEURL || ""),
    },
  };
});
