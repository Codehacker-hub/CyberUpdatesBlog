import PostLists from "../components/PostLists";
import SideMenu from "../components/sideMenu";
import { useState } from "react";

const PostListPage = () => {

  const [open, setOpen] = useState(false)

  return (
    <div>
      <h1 className="mb-8 text-2xl">Devlopment Blog</h1>
      <button onClick={()=>setOpen((prev)=>!prev)} className="md:hidden bg-blue-800 text-sm text-white px-4 py-2 rounded-2xl mb-4">{open ? "close" :  "Filter or Search"}</button>
      <div className="flex flex-col-reverse gap-8 md:flex-row">
        <div className="">
          <PostLists />
        </div>
        <div className={`${open? "block" : "hidden"} md:block`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default PostListPage;
