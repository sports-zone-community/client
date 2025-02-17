import { useContext } from 'react';
import { PostsContext } from '../../components/post/context/PostsContext.tsx';

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be used within a PostsProvider');
  return context;
};
