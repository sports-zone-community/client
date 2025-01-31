import axios, { AxiosInstance, HttpStatusCode } from "axios";
import { config } from "../../config.ts";
import { LoginAxiosResponse } from "../../shared/models/Auth.ts";
import { setTokens } from "../../shared/utils/auth.utils.ts";

const api: AxiosInstance = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 300,
});

const refreshToken = async (): Promise<string | undefined> => {
    try {
        const refreshToken: string | null =
            localStorage.getItem("refreshToken");
        const response = await api.post<LoginAxiosResponse>(
            `${config.authUri}/refreshToken`,
            null,
            {
                headers: { Authorization: `Bearer ${refreshToken}` },
            }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        setTokens(accessToken, newRefreshToken);

        return accessToken;
    } catch (error: any) {
        console.error(`Refresh token failed: ${error.message}`);
    }
};

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

            if (originalRequest.url === `${config.authUri}/refreshToken`) {
                return Promise.reject(error);
            }

            const newToken: string | undefined = await refreshToken();
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default api;
