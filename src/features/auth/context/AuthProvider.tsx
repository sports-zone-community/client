import { ReactNode, useCallback, useEffect, useState } from "react";
import { User } from "../../../shared/models/User.ts";
import serverApi from "../../api/serverApi.ts";
import {
    AuthContextType,
    AuthResponse,
    LoginAxiosRequest,
    LoginAxiosResponse,
    RegisterAxiosRequest,
    RegisterAxiosResponse,
} from "../../../shared/models/Auth.ts";
import axios from "axios";
import AuthContext from "./AuthContext.tsx";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const initAuth = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const response = await serverApi.post("/auth/verify", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    const getErrorMessage = (error: any): string => {
        return (
            error?.response?.data?.error ??
            error?.message ??
            "An error occurred"
        );
    };

    const register = async (
        data: RegisterAxiosRequest
    ): Promise<AuthResponse> => {
        setIsLoading(true);

        try {
            const response = await serverApi.post<RegisterAxiosResponse>(
                "/auth/register",
                data
            );
            return { success: true, ...response.data };
        } catch (error: any) {
            const errorMessage = `Registration Failed: ${getErrorMessage(error)}`;
            console.error(errorMessage);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginAxiosRequest): Promise<AuthResponse> => {
        setIsLoading(true);

        try {
            const response = await serverApi.post<LoginAxiosResponse>(
                "/auth/login",
                data
            );

            const { accessToken, refreshToken } = response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${accessToken}`;

            const userResponse = await serverApi.get<{ user: User }>(
                "/auth/verify"
            );

            setUser(userResponse.data.user);

            return { success: true, message: "Login successful" };
        } catch (error: any) {
            console.error(`Login Failed: ${getErrorMessage(error)}`);
            return { success: false, message: "Login failed" };
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        // Open Google OAuth popup
        window.open("/api/auth/google", "_self");
    };

    const loginWithFacebook = async () => {
        // Open Facebook OAuth popup
        window.open("/api/auth/facebook", "_self");
    };

    const logout = async (): Promise<void> => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await serverApi.post("/auth/logout", null, {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                });
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
            delete axios.defaults.headers.common["Authorization"];
        }
    };

    const refreshAccessToken = async (): Promise<string> => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await serverApi.post<LoginAxiosResponse>(
                "/auth/refresh-token",
                null,
                {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                }
            );

            const { accessToken, refreshToken: newRefreshToken } =
                response.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            axios.defaults.headers.common["Authorization"] =
                `Bearer ${accessToken}`;

            return accessToken;
        } catch (error) {
            await logout();
            throw new Error("Session expired");
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        register,
        login,
        logout,
        refreshAccessToken,
        loginWithGoogle,
        loginWithFacebook,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
