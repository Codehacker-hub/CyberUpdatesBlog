import Image from "./Image";
import { Link } from "react-router-dom";

const FeaturedPost = () => {
  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      {/* Featured Post */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Image */}
        <Image
          src="featured1.jpeg" // Replace with the correct image path
          className="rounded-3xl object-cover"
          w="895"
        />
        {/* Details */}
        <div className="flex items-center gap-4">
          <h1 className="font-semibold lg:text-lg">01.</h1>
          <Link className="text-blue-800 lg:text-lg" to="/category/cyber-security">
            Cyber Security
          </Link>
          <span className="text-gray-500">2 days ago</span>
        </div>
        {/* Title */}
        <Link
          to="/post/cybersecurity-plan"
          className="text-xl lg:text-3xl font-semibold lg:font-bold"
        >
          A Comprehensive Guide to Building a Cybersecurity Plan
        </Link>
      </div>

      {/* Other Posts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        {/* First Post */}
        <div className="flex gap-4 items-start">
          {/* Image */}
          <div className="w-1/3">
            <Image
              src="featured2.jpeg" // Replace with the correct image path
              className="rounded-3xl object-cover"
              w="298"
            />
          </div>
          {/* Details and Title */}
          <div className="w-2/3 flex flex-col gap-2">
            <div className="flex items-center gap-4 text-sm lg:text-base">
              <h1 className="font-semibold lg:text-lg">02.</h1>
              <Link className="text-blue-800 lg:text-lg" to="/category/digital-marketing">
                Digital Marketing
              </Link>
              <span className="text-gray-500">4 days ago</span>
            </div>
            <Link
              to="/post/digital-marketing-guide"
              className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl font-medium"
            >
              The Ultimate Guide to Digital Marketing Success
            </Link>
          </div>
        </div>

        {/* Second Post */}
        <div className="flex gap-4 items-start">
          {/* Image */}
          <div className="w-1/3 relative">
            <Image
              src="featured3.jpeg" // Replace with the correct image path
              className="rounded-3xl object-cover"
              w="298"
            />
          </div>
          {/* Details and Title */}
          <div className="w-2/3 flex flex-col gap-2">
            <div className="flex items-center gap-4 text-sm lg:text-base">
              <h1 className="font-semibold lg:text-lg">03.</h1>
              <Link className="text-blue-800 lg:text-lg" to="/category/ai">
                AI & Machine Learning
              </Link>
              <span className="text-gray-500">1 week ago</span>
            </div>
            <Link
              to="/post/ai-in-cybersecurity"
              className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl font-medium"
            >
              Exploring the Role of AI in Cybersecurity
            </Link>
          </div>
        </div>

        {/* Third Post */}
        <div className="flex gap-4 items-start">
          {/* Image */}
          <div className="w-1/3">
            <Image
              src="featured4.jpeg" // Replace with the correct image path
              className="rounded-3xl object-cover"
              w="298"
            />
          </div>
          {/* Details and Title */}
          <div className="w-2/3 flex flex-col gap-2">
            <div className="flex items-center gap-4 text-sm lg:text-base">
              <h1 className="font-semibold lg:text-lg">04.</h1>
              <Link className="text-blue-800 lg:text-lg" to="/category/ethical-hacking">
                Ethical Hacking
              </Link>
              <span className="text-gray-500">2 weeks ago</span>
            </div>
            <Link
              to="/post/ethical-hacking-tools"
              className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl font-medium"
            >
              Top Tools Every Ethical Hacker Should Know
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
