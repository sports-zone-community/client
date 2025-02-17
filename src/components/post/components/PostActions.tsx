import { CommentModel } from '../../../shared/models/Comment.ts';
import { useState } from 'react';
import { toggleLike } from '../../../features/api/posts.ts';
import { ChatBubbleOvalLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../../shared/hooks/useAuth.ts';
import CommentsModal from './CommentsModal.tsx';
import { addComment, fetchCommentsByPostId } from '../../../features/api/comments.ts';

export interface PostActionsProps {
  postId: string;
  likes: string[];
  comments: CommentModel[];
}

const PostActions = ({ postId, likes, comments }: PostActionsProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(likes.includes(user!._id));
  const [likeCount, setLikeCount] = useState(likes.length);
  const [commentsState, setCommentsState] = useState<CommentModel[]>(comments);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const handleToggleLike = async () => {
    await toggleLike(postId);
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleCommentAdded = async (newComment: string) => {
    await addComment(postId, newComment);
    const updatedComments = await fetchCommentsByPostId(postId);
    setCommentsState(updatedComments);
  };

  const handleOpenComments = () => {
    setIsCommentsModalOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsModalOpen(false);
  };

  return (
    <div className="w-full h-8 flex flex-row items-center gap-2">
      <button onClick={handleToggleLike}>
        {isLiked ? (
          <HeartIconSolid className="w-7 h-7 text-red-500" />
        ) : (
          <HeartIcon className="w-7 h-7 stroke-white" />
        )}
      </button>
      <span className="text-white text-xs">{likeCount}</span>
      <button onClick={handleOpenComments}>
        <ChatBubbleOvalLeftIcon className="w-7 h-7 stroke-white" />
      </button>
      <span className="text-white text-xs">{commentsState.length}</span>
      {isCommentsModalOpen && (
        <CommentsModal
          comments={commentsState}
          onCommentAdded={handleCommentAdded}
          onClose={handleCloseComments}
        />
      )}
    </div>
  );
};
export default PostActions;
