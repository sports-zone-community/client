import api from "./api.ts";
import { CommentModel } from "../../shared/models/Comment.ts";

export const fetchCommentsByPostId = async (
    postId: string
): Promise<CommentModel[]> => {
    const response = await api.get<CommentModel[]>("comments", {
        params: { postId },
    });
    return response.data;
};

export const addComment = async (
    postId: string,
    content: string
): Promise<CommentModel> => {
    const response = await api.post<CommentModel>("comments", {
        postId,
        content,
    });
    return response.data;
};
