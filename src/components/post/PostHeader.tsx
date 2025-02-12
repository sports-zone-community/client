import { getTimeElapsed } from '../../shared/utils/post.utils.ts';
import { config } from '../../config.ts';
import PostOptions from './PostOptions.tsx';
import { useAuth } from '../../shared/hooks/useAuth.ts';

export interface PostHeaderProps {
  postId: string;
  userImage: string;
  username: string;
  createdAt: Date;
  removePost: (postId: string) => void;
}

const PostHeader = ({ userImage, username, createdAt, postId, removePost }: PostHeaderProps) => {
  const { user } = useAuth();
  return (
    <div className="w-full h-8 gap-2 flex flex-row">
      <img src={`${config.apiUrl}/${userImage}`} alt="user-icon" className="w-8 h-8 rounded-full" />
      <div className="flex flex-col items-baseline justify-between">
        <span className="text-white text-sm">{username}</span>
        <span className="text-gray-400 text-xs">{getTimeElapsed(createdAt)}</span>
      </div>
      {username === user?.username && <PostOptions postId={postId} removePost={removePost} />}
    </div>
  );
};

export default PostHeader;
