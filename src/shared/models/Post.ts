import { CommentModel } from "./Comment.ts";

export interface PostModel {
    _id: string;
    content: string;
    image: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    likes: string[];
    groupId?: string;
}

export interface PostPreview extends PostModel {
    comments: CommentModel[];
    username: string;
    userImage: string;
}
