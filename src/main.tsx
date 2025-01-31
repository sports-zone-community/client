import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config.ts";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={config.googleClientId}>
        {/*<StrictMode>*/}
        <App />
        {/*</StrictMode>*/}
    </GoogleOAuthProvider>
);
