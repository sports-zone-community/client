import { CommentModel, CommentPreview } from "../models/Comment.ts";
import { fetchUserById } from "../../features/api/user.ts";

export const loadComments = async (
    comments: CommentModel[]
): Promise<CommentPreview[]> => {
    return await Promise.all(
        comments.map(async (comment) => {
            const { username, picture } = await fetchUserById(comment.userId);
            return { ...comment, username, userImage: picture };
        })
    );
};
