import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    envDir: "./environments",
    resolve: {
        alias: {
            assets: path.resolve(__dirname, "src/assets"),
        },
    },
    server: {
        https:
            mode === "production"
                ? {
                      key: "../client-key.pem",
                      cert: "../client-cert.pem",
                  }
                : undefined,
    },
}));
