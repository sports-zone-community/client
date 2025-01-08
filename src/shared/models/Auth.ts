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

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginAxiosRequest) => Promise<void>;
    register: (data: RegisterAxiosRequest) => Promise<void>;
    refreshAccessToken: () => Promise<string>;
    loginWithGoogle: () => void;
    logout: () => Promise<void>;
}
