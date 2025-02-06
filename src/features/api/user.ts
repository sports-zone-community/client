import api from "./api.ts";
import { UserModel } from "../../shared/models/User.ts";

export const fetchUserById = async (userId: string): Promise<UserModel> => {
    const response = await api.get<UserModel>(`users/details`, {
        params: { userId },
    });
    return response.data;
};
