import Post from '../../components/post/Post.tsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePosts } from '../../shared/hooks/usePosts.ts';
import { useEffect, useState } from 'react';
import Group from '../../components/groups/Group.tsx';
import { GroupModel } from '../../shared/models';
import { useGroups } from '../../shared/hooks/useGroups.ts';
import { toast } from 'react-toastify';
import { ToastContent } from '../../components/toastContent/toastContent';
import { ToastType } from '../../shared/enums/ToastType';
import { toastConfig } from '../../shared/functions/toastConfig.ts';

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const { posts, loadMorePosts, hasMore } = usePosts();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { groups, getGroups, isLoading, error, setError } = useGroups();

  useEffect(() => {
    loadPosts();
    getGroups();
  }, []);

  useEffect(() => {
    setPage(1);
    loadPosts(1);
  }, [selectedGroupId]);

  useEffect(() => {
    if (error) {
      toast.error(
        <ToastContent 
          message="Error loading groups" 
          description="Please try again later" 
          type={ToastType.ERROR} 
        />,
        {
          ...toastConfig,
          onClose: () => setError(null)
        }
      );
    }
  }, [error, setError]);

  const handleGroupSelect = (groupId: string): void =>
    setSelectedGroupId((prevId: string | null) =>
      groupId === prevId ? null : groupId
    );

  const loadPosts = async (newPage?: number): Promise<void> => {
    await loadMorePosts(newPage || page, selectedGroupId || undefined);
    setPage(newPage ? newPage + 1 : (prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-x-auto scrollbar-hide py-8 no-scrollbar">
        <div className="flex gap-6 px-6 min-w-max">
          {isLoading ? (
            <div className="w-full text-center py-4">
              <h4 className="text-white">Loading groups...</h4>
            </div>
          ) : groups.length === 0 ? (
            <div className="w-full text-center py-4">
              <p className="text-white">You are not a member of any groups</p>
            </div>
          ) : (
            groups.map((group: GroupModel) => (
              <Group
                key={group._id}
                group={group}
                selectedGroupId={selectedGroupId}
                onGroupSelect={handleGroupSelect}
              />
            ))
          )}
        </div>
      </div>
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
