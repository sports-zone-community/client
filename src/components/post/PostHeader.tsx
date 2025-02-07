import { getTimeElapsed } from "../../shared/utils/post.utils.ts";

export interface PostHeaderProps {
    userImage: string;
    username: string;
    createdAt: Date;
}

const PostHeader = ({ userImage, username, createdAt }: PostHeaderProps) => {
    return (
        <div className="w-full h-8 gap-2 flex flex-row">
            <img
                src={userImage}
                alt="user-icon"
                className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col items-baseline justify-between">
                <span className="text-white text-sm">{username}</span>
                <span className="text-gray-400 text-xs">
                    {getTimeElapsed(createdAt)}
                </span>
            </div>
        </div>
    );
};

export default PostHeader;
