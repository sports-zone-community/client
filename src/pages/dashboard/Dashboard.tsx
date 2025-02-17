import Post from '../../components/post/Post.tsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePosts } from '../../shared/hooks/usePosts.ts';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const { posts, loadMorePosts, hasMore } = usePosts();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    await loadMorePosts(page);
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <InfiniteScroll
        dataLength={posts.length}
        next={loadPosts}
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
            <Post key={post._id} post={post} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
