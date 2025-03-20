import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from '../../components/post/Post.tsx';
import { FaComment, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { config } from '../../config.ts';
import { GroupModel, UserModel } from '../../shared/models';
import { PostModel, PostPreview } from '../../shared/models/Post.ts';
import { fetchCommentsByPostId } from '../../features/api/comments.ts';
import api from '../../features/api/api.ts';
import { fetchUserById } from '../../features/api/user.ts';
import { useAuth } from '../../shared/hooks/useAuth.ts';

const GroupProfile = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupModel | null>(null);
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isMember, setIsMember] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadGroupProfile();
    setPage(1);
    loadPosts(1);
  }, [groupId]);

  useEffect(() => {
    checkIfMember();
  }, [group])

  const fetchGroupById = async (groupId: string): Promise<GroupModel> => {
    return (await api.get<GroupModel>(`/groups/${groupId}`)).data;
  };

  const loadGroupProfile = async () => {
    console.log('new group id', groupId);
    const group: GroupModel = await fetchGroupById(groupId!);
    setGroup(group);
  };

  const loadMorePosts = async (page: number, groupId: string) => {
    const newPosts = await fetchGroupPosts(page, groupId!);

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

  const fetchGroupPosts = async (page: number, groupId: string): Promise<PostPreview[]> => {
    const groupPosts: PostModel[] = (
      await api.get<PostModel[]>(`/posts/group/${groupId}`, { params: { page } })
    ).data;

    return await Promise.all(
      groupPosts.map(async (post: PostModel) => {
        const comments = await fetchCommentsByPostId(post._id);
        const { username, picture } = await fetchUserById(post.userId);
        return { ...post, comments, username, userImage: picture };
      }),
    );
  };

  const loadPosts = async (newPage?: number): Promise<void> => {
    await loadMorePosts(newPage || page, groupId!);
    setPage(newPage ? newPage + 1 : (prevPage) => prevPage + 1);
  };

  const checkIfMember = async () => {
    const updatedGroup: GroupModel | null = group && (await fetchGroupById(group._id));
    const updatedUser: UserModel = await fetchUserById(user!._id);
    if (updatedGroup && user && updatedGroup.members.includes(updatedUser._id)) {
      setIsMember(true);
    } else {
      setIsMember(false);
    }
  };

  const toggleMembership = async () => {
    await api.post(`/groups/toggle-join/${groupId}`);
    setIsMember((prev) => !prev);
  };

  if (!group) return <div>Loading...</div>;

  const groupPicture = group.image.startsWith('https')
    ? group.image
    : `${config.apiUrl}/${group.image}`;

  return (
    <div className="flex flex-col items-center h-full bg-gray-900">
      <div className="flex w-full p-8 bg-gray-800 text-white justify-between">
        <div className="flex items-center">
          <img
            src={groupPicture}
            alt={`${group.name}'s profile`}
            className="w-32 h-32 rounded-full"
          />
          <div className="ml-8">
            <h2 className="text-2xl font-bold">{group.name}</h2>
            <p className="text-m">{group.members.length} Members</p>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <button
            className={`bg-${isMember ? 'red' : 'green'}-500 text-white px-4 py-3 rounded flex items-center justify-center w-40`}
            onClick={toggleMembership}
          >
            {isMember ? <FaUserMinus /> : <FaUserPlus />}
            <span className="px-2">{isMember ? 'Leave Group' : 'Join Group'}</span>
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-3 rounded flex items-center justify-center w-40"
            onClick={() => navigate(`/inbox`)}
          >
            <FaComment className="mr-2" /> <span className="px-2">Open Chat</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full p-4 bg-gray-900 text-white">
        <h2 className="text-center text-2xl font-bold mb-4">Group Posts</h2>
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
          scrollableTarget="scrollableDiv"
        >
          <div className="flex flex-col gap-4 items-center text-black">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default GroupProfile;
