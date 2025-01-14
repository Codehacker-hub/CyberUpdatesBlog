import PostListItems from "./PostListItems";

const PostLists = () => {
  return (
    <div className="flex flex-col gap-12 mb-8">
        <PostListItems/>
        <PostListItems/>
        <PostListItems/>
        <PostListItems/>
        <PostListItems/>
    </div>
  );
};

export default PostLists;