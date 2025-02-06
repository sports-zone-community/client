export interface CommentModel {
    _id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentPreview extends CommentModel {
    username: string;
    userImage: string;
}
