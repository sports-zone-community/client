import axios, { AxiosInstance, HttpStatusCode } from "axios";
import { config } from "../../config.ts";

let refreshTokenMethod: (() => Promise<void>) | undefined = undefined;

export const setRefreshTokenMethod = (method: () => Promise<void>) => {
    refreshTokenMethod = method;
};

const api: AxiosInstance = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 300,
});

api.interceptors.request.use(
    (config) => {
        const token: string | null = localStorage.getItem("accessToken");
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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error?.response?.status === HttpStatusCode.Unauthorized &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (shouldNotRetry(originalRequest.url)) {
                return Promise.reject(error);
            }

            if (refreshTokenMethod) {
                await refreshTokenMethod();
            } else {
                return Promise.reject("Refresh token method not set");
            }
            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);

const shouldNotRetry = (url: string) =>
    url.includes(config.authUri) && !url.includes("verify");

export default api;
