import { UserModel } from "./User.ts";

export interface RegisterAxiosRequest {
    name: string;
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
    user: UserModel | null;
    isLoading: boolean;
    login: (data: LoginAxiosRequest) => Promise<void>;
    register: (data: RegisterAxiosRequest) => Promise<void>;
    loginWithGoogle: () => void;
    logout: () => Promise<void>;
}
