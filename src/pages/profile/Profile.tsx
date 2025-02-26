import InfiniteScroll from 'react-infinite-scroll-component';
import { useState, useEffect } from 'react';
import Post from '../../components/post/Post.tsx';
import { usePosts } from '../../shared/hooks/usePosts.ts';
import { FaPlus, FaCog } from 'react-icons/fa';

const Profile = () => {
  const [page, setPage] = useState(1);
  const { posts, loadMorePosts, hasMore } = usePosts();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (newPage?: number): Promise<void> => {
    await loadMorePosts(newPage || page);
    setPage(newPage ? newPage + 1 : (prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* First Part */}
      <div className="flex w-full h-1/5 p-4 bg-gray-800 text-white">
        <div className="flex items-center w-1/3">
          <img src="/path/to/user/image.jpg" alt="User" className="w-24 h-24 rounded-full" />
          <div className="ml-4">
            <h2 className="text-xl font-bold">Username</h2>
            <p className="text-sm">Full Name</p>
            <div className="flex space-x-4">
              <p className="text-sm">100 Followers</p>
              <p className="text-sm">50 Following</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center w-2/3 space-y-4">
          <button className="bg-blue-500 text-white px-3 py-1 rounded flex items-center w-32">
            <FaPlus className="mr-2" /> <span className="ml-auto">Add Post</span>
          </button>
          <button className="bg-gray-500 text-white px-3 py-1 rounded flex items-center w-32">
            <FaCog className="mr-2" /> <span className="ml-auto">Settings</span>
          </button>
        </div>
      </div>

      {/* Second Part */}
      <div className="flex flex-col w-full h-4/5 p-4 bg-gray-900 text-white">
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

export default Profile;
