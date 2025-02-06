import { Provider } from "../enums/provider.enum.ts";

export interface UserModel {
    _id: string;
    username: string;
    email: string;
    name: string;
    picture: string;
    provider: Provider;
    following: string[];
    googleId?: string;
}
