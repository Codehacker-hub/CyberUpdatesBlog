import { useUser } from "@clerk/clerk-react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css';

const WritePage = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (isLoaded && !isSignedIn) {
    return <div>You should Be login!!!</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] md:h[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Post</h1>
      <form className="flex flex-col flex-1 mb-6 gap-6">
        <button className=" w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">Add a cover image</button>
        <input  className="text-4xl font-semibold bg-transparent outline-none" type="text" placeholder="My Awesome Story" />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">Choose a Category</label>
          <select className="p-2 rounded-xl bg-white shadow-md" name="category" id="">
            <option value="general">General</option>
            <option value="cybersecurity">Cyber Security</option>
            <option value="ethicalhacking">Ethical Hacking</option>
            <option value="technews">Tech News</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>
        <textarea name="desc" placeholder="Write Short Description" className="p-4 rounded-xl bg-white shadow-md"/>
        <ReactQuill theme="snow" placeholder="Write Your Story" className="flex-1  rounded-xl bg-white shadow-md" />
       <button className="bg-blue-800 text-white font-medium rounded-xl mt-4  p-2 w-36">Post</button>
      </form>
    </div>
  );
};

export default WritePage;
