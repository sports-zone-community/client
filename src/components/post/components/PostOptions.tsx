import { useEffect, useRef, useState } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { deletePost } from '../../../features/api/posts.ts';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../../shared/hooks/usePosts.ts';

export interface PostOptionsProps {
  postId: string;
}

const PostOptions = ({ postId }: PostOptionsProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { removePost } = usePosts();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    try {
      await deletePost(postId);
      removePost(postId);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Could not delete post');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-post/${postId}`);
  };

  return (
    <div ref={popupRef} className="relative ml-auto">
      <EllipsisHorizontalIcon
        className="h-6 w-6 text-gray-300 cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
      />

      {showOptions && (
        <div className="absolute right-0 top-8 bg-gray-800 rounded-lg shadow-lg">
          <button
            className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            onClick={() => handleEdit()}
          >
            Edit
          </button>
          <button
            className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            onClick={() => handleDelete()}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostOptions;
