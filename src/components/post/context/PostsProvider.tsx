import { ReactNode, useState } from 'react';
import { PostPreview } from '../../../shared/models/Post.ts';
import { fetchPostsWithAdditionalData } from '../../../features/api/posts.ts';
import { PostsContext } from './PostsContext.tsx';

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = async (page: number, groupId?: string) => {
    const newPosts = await fetchPostsWithAdditionalData(page, groupId);
    
    if (page === 1) {
      setPosts(newPosts);
      setHasMore(newPosts.length === 5);
      return;
    }
    
    if (newPosts.length === 0 || newPosts.length < 5) {
      setHasMore(false);
      if (newPosts.length === 0) return;
    }
    
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
  };

  const removePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const getPostById = (postId: string) => {
    return posts.find((post) => post._id === postId);
  };

  return (
    <PostsContext.Provider value={{ posts, getPostById, loadMorePosts, removePost, hasMore }}>
      {children}
    </PostsContext.Provider>
  );
};
