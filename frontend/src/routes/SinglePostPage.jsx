import Image from "../components/Image";
import { Link } from "react-router-dom";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
const SinglePostPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Details */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            Cyber Security is Very negligble in India.
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written By</span>
            <Link className="text-blue-800">Ashutosh</Link>
            <span>on</span>
            <Link className="text-blue-800">July 15, 2022</Link>
          </div>
          <p className="text-gray-500 font-medium">
            Cybersecurity is a critical aspect of maintaining an effective and
            secure digital environment. While some countries, like India, have
            successfully implemented robust cybersecurity measures, others, like
            the United States, have not.
          </p>
        </div>
        <div className="hidden lg:block w-2/5">
          <Image src="postImg.jpeg" w="600" className={"rounded-2xl"} />
        </div>
      </div>
      {/* Content */}
      <div className=" flex flex-col md:flex-row gap-12 ">
        {/* text */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
          <h2 className="text-2xl font-semibold">What is Cybersecurity?</h2>
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>{" "}
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>{" "}
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>
          <p className="text-gray-500">
            Cybersecurity is the protection and security of digital systems,
            networks, and data from unauthorized access, disruption,
            destruction, or unauthorized modification. Cybersecurity is crucial
            for maintaining the security of critical infrastructure, sensitive
            personal information, and sensitive financial data.
          </p>
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className=" mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              <Image
                src={"userImg.jpeg"}
                className={"w-12 h-12 rounded-full object-cover "}
                w={"48"}
                h={"48"}
              />
              <Link className="text-blue-800">Ashutosh</Link>
            </div>
            <p className=" text-sm text-gray-500">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi in
              odit
            </p>
            <div className="flex gap-2">
              <Link>
                <Image src={"facebook.svg"} />
              </Link>
              <Link>
                <Image src={"instagram.svg"} />
              </Link>
            </div>
          </div>
          <PostMenuActions />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline">All</Link>
            <Link>Cybersecurity</Link>
            <Link>Technology</Link>
            <Link>Education</Link>
            <Link>Government</Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      {/* Comments */}
      <Comments/>
    </div>
  );
};

export default SinglePostPage;
