import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId="1097571225821-ll6cevu6crj4guq1jrftnngkns7u0ivr.apps.googleusercontent.com">
        <StrictMode>
            <App />
        </StrictMode>
    </GoogleOAuthProvider>
);
