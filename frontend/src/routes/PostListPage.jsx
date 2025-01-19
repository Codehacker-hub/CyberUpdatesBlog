import { useState } from "react";
import PostLists from "../components/PostLists";
import SideMenu from "../components/SideMenu";

const PostListPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto px-4">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">Blogs</h1>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4 md:hidden"
      >
        {open ? "Close" : "Filter or Search"}
      </button>
      <div className="flex flex-col-reverse md:flex-row gap-8">
        {/* Posts Section */}
        <div className="flex-1">
          <PostLists />
        </div>

        {/* SideMenu Section */}
        <div
          className={`${
            open ? "block" : "hidden"
          } md:block w-full md:w-1/3 lg:w-1/4`}
        >
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
