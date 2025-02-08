import { ReactNode, useCallback, useEffect, useState } from "react";
import {
    AuthContextType,
    LoginAxiosRequest,
    LoginAxiosResponse,
    RegisterAxiosRequest,
    RegisterAxiosResponse,
    UserModel,
} from "../../../shared/models";
import api, { setRefreshTokenMethod } from "../../../features/api/api.ts";
import { AxiosResponse } from "axios";
import AuthContext from "./AuthContext.tsx";
import { useGoogleLogin } from "@react-oauth/google";
import Popup from "../../common/Popup.tsx";
import { useNavigate } from "react-router-dom";
import { config } from "../../../config.ts";
import { setToken } from "../../../shared/utils/auth.utils.ts";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [popupMessage, setPopup] = useState<string>("");
    const navigate = useNavigate();
    const authUri: string = config.authUri;

    useEffect(() => {
        const initAuth = async () => {
            await verifyUser();
            setIsLoading(false);
            navigate("/dashboard");
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

            const { accessToken } = response.data;
            setToken(accessToken);

            await verifyUser();

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

                const { accessToken } = response.data;

                setToken(accessToken);
                await verifyUser();
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
            setUser(null);
        }
    };

    const verifyUser = async () => {
        try {
            const response = await api.get<UserModel>(`${authUri}/verify`);
            setUser(response.data);
        } catch (error) {
            console.error("Verify user failed:", error);
            localStorage.removeItem("accessToken");
        }
    };

    const refreshToken = useCallback(async (): Promise<void> => {
        try {
            const response = await api.post<LoginAxiosResponse>(
                `${config.authUri}/refreshToken`
            );

            const { accessToken } = response.data;
            setToken(accessToken);
        } catch (error: any) {
            console.error(`Refresh token failed: ${error.message}`);
            logout();
        }
    }, []);

    useEffect(() => {
        setRefreshTokenMethod(refreshToken);
    }, [refreshToken]);

    const value: AuthContextType = {
        user,
        isLoading,
        register,
        login,
        logout,
        loginWithGoogle,
        refreshToken,
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
