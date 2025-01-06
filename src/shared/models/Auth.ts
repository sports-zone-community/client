import { User } from "./User.ts";

export interface RegisterAxiosRequest {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

export interface RegisterAxiosResponse {
    message: string;
}

export interface LoginAxiosRequest {
    email: string;
    password: string;
}

export interface LoginAxiosResponse {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    message: string;
    success: boolean;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginAxiosRequest) => Promise<AuthResponse>;
    register: (data: RegisterAxiosRequest) => Promise<AuthResponse>;
    refreshAccessToken: () => Promise<string>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    logout: () => Promise<void>;
}
