import { ReactNode, useCallback, useEffect, useState } from "react";
import { User } from "../../../shared/models/User.ts";
import serverApi from "../../api/serverApi.ts";
import {
    AuthContextType,
    LoginAxiosRequest,
    LoginAxiosResponse,
    RegisterAxiosRequest,
    RegisterAxiosResponse,
} from "../../../shared/models/Auth.ts";
import axios from "axios";
import AuthContext from "./AuthContext.tsx";
import { useGoogleLogin } from "@react-oauth/google";
import Popup from "../../../components/common/Popup.tsx";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [popupMessage, setPopup] = useState<string>("");
    const navigate = useNavigate();

    const initAuth = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                await verifyUser(accessToken);
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

    const register = async (data: RegisterAxiosRequest): Promise<void> => {
        setIsLoading(true);

        try {
            await serverApi.post<RegisterAxiosResponse>("/auth/register", data);
            setPopup("Registration successful. You can now login");
        } catch (error: any) {
            setPopup("Registration failed. Please try again");
            const errorMessage = `Registration Failed: ${getErrorMessage(error)}`;
            console.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginAxiosRequest): Promise<void> => {
        setIsLoading(true);

        try {
            const response = await serverApi.post<LoginAxiosResponse>(
                "/auth/login",
                data
            );

            const { accessToken, refreshToken } = response.data;
            setTokens(accessToken, refreshToken);

            await verifyUser(accessToken);

            navigate("/dashboard");
        } catch (error: any) {
            console.error(`Login Failed: ${getErrorMessage(error)}`);
            setPopup("Login failed. Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        flow: "auth-code",
        scope: "openid email profile",
        onSuccess: async (response) => {
            setIsLoading(true);
            try {
                const result = await serverApi.post<LoginAxiosResponse>(
                    "/auth/google",
                    {
                        token: response.code,
                    }
                );

                const { accessToken, refreshToken } = result.data;

                setTokens(accessToken, refreshToken);
                await verifyUser(accessToken);
                navigate("/dashboard");
            } catch (error) {
                console.error("Google login failed:", getErrorMessage(error));
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => console.error("Google login error:", error),
    });

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

            setTokens(accessToken, newRefreshToken);

            return accessToken;
        } catch (error) {
            await logout();
            throw new Error("Session expired");
        }
    };

    const setTokens = (accessToken: string, refreshToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        axios.defaults.headers.common["Authorization"] =
            `Bearer ${accessToken}`;
    };

    const verifyUser = async (accessToken: string) => {
        try {
            const response = await serverApi.get("/auth/verify", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setUser(response.data.user);
        } catch (error) {
            console.error("Verify user failed:", error);
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
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            {popupMessage && (
                <Popup message={popupMessage} onClose={() => setPopup("")} />
            )}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
