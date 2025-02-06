import api from "./api.ts";
import { PostModel } from "../../shared/models/Post.ts";

export const fetchPosts = async (page: number): Promise<PostModel[]> => {
    const response = await api.get<PostModel[]>(`/posts/explore`, {
        params: { page },
    });
    return response.data;
};

export const toggleLike = async (postId: string): Promise<void> => {
    await api.post(`/posts/toggle-like/${postId}`);
};
