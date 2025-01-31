import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    envDir: "./environments",
    server: {
        https: {
            key: "./certs/localhost-key.pem",
            cert: "./certs/localhost.pem",
        },
    },
});
