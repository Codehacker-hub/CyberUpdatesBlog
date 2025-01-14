import { Link } from "react-router-dom";
import Image from "./Image";
const PostListItems = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/*Images*/}
      <div className="md:hidden xl:block xl:w-1/3">
        <Image src="postImg.jpeg" className="rounded-2xl object-cover " w="735" />
      </div>
      {/* Details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to="/test" className="text-4xl font-semibold">
          Cyber Security is Very negligble in India.
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written By</span>
          <Link className="text-blue-800">Ashutosh</Link>
          <span>on</span>
          <Link className="text-blue-800">July 15, 2022</Link>
        </div>
        <p>
          Cybersecurity is a critical aspect of maintaining an effective and
          secure digital environment. While some countries, like India, have
          successfully implemented robust cybersecurity measures, others, like
          the United States, have not.
        </p>
        <Link to="/test" className="underline text-sm text-blue-800">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItems;
