import { ReactNode, useEffect, useState } from "react";
import { User } from "../../../shared/models/User.ts";
import api from "../../api/api.ts";
import {
    AuthContextType,
    LoginAxiosRequest,
    LoginAxiosResponse,
    RegisterAxiosRequest,
    RegisterAxiosResponse,
} from "../../../shared/models/Auth.ts";
import axios, { AxiosResponse } from "axios";
import AuthContext from "./AuthContext.tsx";
import { useGoogleLogin } from "@react-oauth/google";
import Popup from "../../../components/common/Popup.tsx";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config.ts";
import { setTokens } from "../../../shared/utils/auth.utils.ts";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [popupMessage, setPopup] = useState<string>("");
    const navigate = useNavigate();
    const authUri: string = config.authUri;

    useEffect(() => {
        const initAuth = async () => {
            const accessToken: string | null =
                localStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    await verifyUser(accessToken);
                    navigate("/dashboard");
                } catch (error) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

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
            await api.post<RegisterAxiosResponse>(`${authUri}/register`, data);
            setPopup("Registration successful. You can now login");
        } catch (error) {
            setPopup("Registration failed. Please try again");
            console.error(`Registration Failed: ${getErrorMessage(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginAxiosRequest): Promise<void> => {
        setIsLoading(true);

        try {
            const response: AxiosResponse<LoginAxiosResponse> =
                await api.post<LoginAxiosResponse>(`${authUri}/login`, data);

            const { accessToken, refreshToken } = response.data;
            setTokens(accessToken, refreshToken);

            await verifyUser(accessToken);

            navigate("/dashboard");
        } catch (error) {
            console.error(`Login Failed: ${getErrorMessage(error)}`);
            setPopup("Login failed. Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async ({ access_token }) => {
            setIsLoading(true);
            try {
                const response: AxiosResponse<LoginAxiosResponse> =
                    await api.post<LoginAxiosResponse>(`${authUri}/google`, {
                        access_token,
                    });

                const { accessToken, refreshToken } = response.data;

                setTokens(accessToken, refreshToken);
                await verifyUser(accessToken);
                navigate("/dashboard");
            } catch (error) {
                console.error("Google login failed:", getErrorMessage(error));
                setPopup("Login failed. Please try again");
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error("Google login error:", error);
        },
    });

    const logout = async (): Promise<void> => {
        try {
            const refreshToken: string | null =
                localStorage.getItem("refreshToken");
            if (refreshToken) {
                await api.post(`${authUri}/logout`, null, {
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

    const verifyUser = async (accessToken: string) => {
        try {
            const response = await api.get(`${authUri}/verify`, {
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
