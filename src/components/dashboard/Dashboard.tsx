import Post from "../post/Post.tsx";
import { fetchPosts } from "../../features/api/posts.ts";
import { fetchCommentsByPostId } from "../../features/api/comments.ts";
import { fetchUserById } from "../../features/api/user.ts";
import { PostPreview } from "../../shared/models/Post.ts";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const Dashboard = () => {
    const [posts, setPosts] = useState<PostPreview[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMorePosts = async () => {
        const newPosts = await fetchPosts(page);
        if (newPosts.length === 0) {
            setHasMore(false);
            return;
        }

        const postsWithAdditionalData = await Promise.all(
            newPosts.map(async (post) => {
                const comments = await fetchCommentsByPostId(post._id);
                const { username, picture } = await fetchUserById(post.userId);
                return { ...post, comments, username, userImage: picture };
            })
        );

        setPosts((prevPosts) => [...prevPosts, ...postsWithAdditionalData]);
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        loadMorePosts();
    }, []);

    return (
        <div className="flex flex-col items-center">
            <InfiniteScroll
                dataLength={posts.length}
                next={loadMorePosts}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                scrollThreshold={0.9}
                endMessage={<p>No more posts to show.</p>}
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
