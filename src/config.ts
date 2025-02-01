export const config: Config = {
    apiUrl: import.meta.env.VITE_API_URL,
    authUri: import.meta.env.VITE_API_AUTH_URI,
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

export interface Config {
    apiUrl: string;
    authUri: string;
    googleClientId: string;
}
