import { CommentModel, CommentPreview } from '../../../shared/models/Comment.ts';
import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../shared/hooks/useAuth.ts';
import { getTimeElapsed } from '../../../shared/utils/post.utils.ts';
import { loadComments } from '../../../shared/utils/comments.utils.ts';

export interface CommentsModalProps {
  comments: CommentModel[];
  onCommentAdded: (newComment: string) => void;
  onClose: () => void;
}

const CommentsModal = ({ comments, onClose, onCommentAdded }: CommentsModalProps) => {
  const { user } = useAuth();
  const [commentsPreview, setComments] = useState<CommentPreview[]>([]);
  const [newComment, setNewComment] = useState('');

  const initComments = async (comments: CommentModel[]) => {
    const commentsPreview = await loadComments(comments);
    setComments(commentsPreview);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    initComments(comments);
    return () => {
      document.body.style.overflow = '';
    };
  }, [comments]);

  const handleAddComment = () => {
    onCommentAdded(newComment);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {commentsPreview.map((comment, index) => (
            <div key={index} className="flex items-start space-x-3">
              <img
                src={comment.userImage || 'assets/user-icon.png'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-gray-100 p-2 rounded-lg flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{comment.username}</span> {comment.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">{getTimeElapsed(comment.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center mt-4 border-t pt-3">
          <img
            src={user?.picture || 'assets/user-icon.png'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border rounded-full px-3 py-2 flex-grow text-sm focus:outline-none focus:ring focus:border-blue-300 ml-2"
            placeholder="Add a comment..."
          />
          <button
            onClick={handleAddComment}
            className="text-blue-500 font-semibold ml-2 hover:text-blue-600"
            disabled={!newComment.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
