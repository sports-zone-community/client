import { PostPreview } from '../../shared/models/Post.ts';
import PostActions from './components/PostActions.tsx';
import PostHeader from './components/PostHeader.tsx';
import PostContent from './components/PostContent.tsx';
import { config } from '../../config.ts';

export interface PostProps {
  post: PostPreview;
}

const PostComponent = ({ post }: PostProps) => {
  return (
    <div className="flex flex-col items-center gap-2 w-104 h-80 mt-8 mb-8">
      <PostHeader
        userImage={post.userImage}
        username={post.username}
        createdAt={post.createdAt}
        postId={post._id}
      />
      <div className="w-full h-52 rounded">
        <img
          src={`${config.apiUrl}/${post.image}`}
          alt="post-image"
          className="w-full h-full object-cover rounded"
        />
      </div>
      <PostActions postId={post._id} likes={post.likes} comments={post.comments} />
      <PostContent content={post.content} />
    </div>
  );
};

export default PostComponent;
