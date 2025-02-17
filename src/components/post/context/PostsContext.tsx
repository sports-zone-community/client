import { createContext } from 'react';
import { PostPreview } from '../../../shared/models/Post.ts';

interface PostsContextType {
  posts: PostPreview[];
  getPostById: (postId: string) => PostPreview | undefined;
  loadMorePosts: (page: number) => Promise<void>;
  removePost: (postId: string) => void;
  hasMore: boolean;
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined);
