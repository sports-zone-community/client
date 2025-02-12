import api from './api.ts';
import { PostModel, PostPreview } from '../../shared/models/Post.ts';
import { fetchCommentsByPostId } from './comments.ts';
import { fetchUserById } from './user.ts';

export const fetchPosts = async (page: number): Promise<PostModel[]> => {
  const response = await api.get<PostModel[]>(`/posts/explore`, {
    params: { page },
  });
  return response.data;
};

export const fetchPostsWithAdditionalData = async (page: number): Promise<PostPreview[]> => {
  const newPosts = await fetchPosts(page);

  return await Promise.all(
    newPosts.map(async (post) => {
      const comments = await fetchCommentsByPostId(post._id);
      const { username, picture } = await fetchUserById(post.userId);
      return { ...post, comments, username, userImage: picture };
    }),
  );
};

export const toggleLike = async (postId: string): Promise<void> => {
  await api.post(`/posts/toggle-like/${postId}`);
};

export const createPost = async (image: File, content: string, groupId?: string): Promise<void> => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('content', content);
  if (groupId) formData.append('groupId', groupId);

  await api.post<PostModel>(`/posts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/posts/${postId}`);
};
