import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    envDir: "./environments",
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
