import Post from '../../components/post/Post.tsx';
import { fetchPostsWithAdditionalData } from '../../features/api/posts.ts';
import { PostPreview } from '../../shared/models/Post.ts';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Dashboard = () => {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = async () => {
    const newPosts = await fetchPostsWithAdditionalData(page);
    if (newPosts.length === 0 || newPosts.length < 5) {
      setHasMore(false);
      if (newPosts.length === 0) return;
    }

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    loadMorePosts();
  }, []);

  const removePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="flex flex-col items-center">
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={
          <div className="w-full text-center py-4">
            <h4 className="text-white">Loading...</h4>
          </div>
        }
        scrollThreshold={0.9}
        endMessage={
          <div className="w-full text-center py-4">
            <p className="text-white">No more posts to show</p>
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        <div className="flex flex-col gap-8 items-center">
          {posts.map((post) => (
            <Post key={post._id} post={post} removePost={removePost} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
