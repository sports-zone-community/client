import axios, { HttpStatusCode } from "axios";
import { useAuth } from "../../shared/hooks/useAuth.ts";

const serverApi = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

serverApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); // Or from memory
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

serverApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error?.response?.status === HttpStatusCode.Unauthorized &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const auth = useAuth();
                const newToken = await auth.refreshAccessToken();
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return serverApi(originalRequest);
            } catch (refreshError) {
                console.error(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default serverApi;
