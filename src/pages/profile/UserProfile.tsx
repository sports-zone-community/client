import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '../../components/post/Post.tsx';
import { FaCog, FaPlus } from 'react-icons/fa';
import { config } from '../../config.ts';
import { fetchUserById } from '../../features/api/user.ts';
import { UserModel } from '../../shared/models';
import { PostModel, PostPreview } from '../../shared/models/Post.ts';
import { fetchCommentsByPostId } from '../../features/api/comments.ts';
import api from '../../features/api/api.ts';
import { useAuth } from '../../shared/hooks/useAuth.ts';

const UserProfile = ({ profileType }: { profileType: 'own' | 'other' }) => {
  const { userId: paramUserId } = useParams();
  const { user } = useAuth();
  const userId: string = paramUserId || user?._id || '';
  const [profileUser, setProfileUser] = useState<UserModel | null>(null);
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
    setPage(1);
    loadPosts(1);
  }, [userId]);

  const loadUserProfile = async () => {
    const profileUser: UserModel = await fetchUserById(userId);
    setProfileUser(profileUser);
  };

  // From here
  const loadMorePosts = async (page: number, userId: string) => {
    const newPosts = await fetchUserPosts(page, userId);

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

  const fetchUserPosts = async (page: number, userId: string): Promise<PostPreview[]> => {
    const userPosts: PostModel[] = (
      await api.get<PostModel[]>(`/posts/user/${userId}`, { params: { page } })
    ).data;

    return await Promise.all(
      userPosts.map(async (post: PostModel) => {
        const comments = await fetchCommentsByPostId(post._id);
        const { username, picture } = await fetchUserById(post.userId);
        return { ...post, comments, username, userImage: picture };
      }),
    );
  };

  // To Here

  const loadPosts = async (newPage?: number): Promise<void> => {
    await loadMorePosts(newPage || page, userId);
    setPage(newPage ? newPage + 1 : (prevPage) => prevPage + 1);
  };

  if (!profileUser) return <div>Loading...</div>;

  const profilePicture = profileUser.picture.startsWith('https')
    ? profileUser.picture
    : `${config.apiUrl}/${profileUser.picture}`;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex w-full h-1/6 p-4 bg-gray-800 text-white">
        <div className="flex items-center w-1/3">
          <img
            src={profilePicture}
            alt={`${profileUser.username}'s profile`}
            className="w-24 h-24 rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold">@{profileUser.username}</h2>
            <p className="text-sm">{profileUser.name}</p>
            <div className="flex space-x-4">
              <p className="text-sm">{profileUser.following.length} Following</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center w-2/3 space-y-4">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center w-32"
            onClick={() => navigate('/add-post')}
          >
            <FaPlus className="mr-2" /> <span className="ml-auto">Add Post</span>
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded flex items-center w-32"
            onClick={() => navigate('/edit-profile')}
          >
            <FaCog className="mr-2" /> <span className="ml-auto">Settings</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full h-5/6 p-4 bg-gray-900 text-white">
        <h2 className="text-center text-2xl font-bold mb-4">My Posts</h2>
        <InfiniteScroll
          dataLength={posts.length}
          next={loadPosts}
          hasMore={hasMore}
          loader={
            <div className="w-full text-center py-4">
              <h4 className="text-white">Loading...</h4>
            </div>
          }
          endMessage={
            <div className="w-full text-center py-4">
              <p className="text-white">No more posts to show</p>
            </div>
          }
        >
          <div className="flex flex-col gap-4 items-center">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default UserProfile;
