import { useState } from "react";
import axios from "axios";

interface RegisterRequest {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

interface RegisterAxiosResponse {
    message: string;
}

interface RegisterResponse extends RegisterAxiosResponse {
    success: boolean;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getErrorMessage = (error: any): string => {
        return (
            error?.response?.data?.error ??
            error?.message ??
            "An error occurred"
        );
    };

    const register = async (
        data: RegisterRequest
    ): Promise<RegisterResponse> => {
        setIsLoading(true);

        try {
            const response = await axios.post<RegisterAxiosResponse>(
                "http://localhost:3000/auth/register",
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

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        setIsLoading(true);

        try {
            const response = await axios.post<LoginResponse>(
                "http://localhost:3000/auth/login",
                data
            );
            return response.data;
        } catch (error: any) {
            console.error(`Registration Failed: ${getErrorMessage(error)}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, register, login };
};
