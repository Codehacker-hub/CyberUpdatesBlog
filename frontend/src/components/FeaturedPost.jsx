import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaTags, FaCalendarAlt } from "react-icons/fa";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import Loader from "./Loader";
import ErrorFallback from "./ErrorFallback"; // Import the reusable ErrorFallback component

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
  );
  return res.data;
};

const PostCard = ({ post, index, layout = "horizontal" }) => {
  const isHorizontal = layout === "horizontal";

  return (
    <div
      className={`flex ${
        isHorizontal ? "lg:h-1/3 justify-between" : "flex-col"
      } gap-4 group`}
    >
      {post.img && (
        <div
          className={`${
            isHorizontal ? "w-1/3 aspect-video" : "w-full"
          } rounded-3xl overflow-hidden`}
        >
          <Image
            src={post.img}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            w={isHorizontal ? "298" : "895"}
          />
        </div>
      )}
      <div className={isHorizontal ? "w-2/3" : "w-full"}>
        <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
          <h1 className="font-semibold text-blue-800">{index}.</h1>
          <Link
            to={`/category/${post.category}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaTags className="inline-block mr-1" />
            {post.category}
          </Link>
          <span className="text-gray-500">
            <FaCalendarAlt className="inline-block mr-1" />
            {format(post.createdAt)}
          </span>
        </div>
        <Link
          to={post.slug}
          className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium text-gray-800 hover:text-blue-600 transition-colors"
        >
          {post.title}
        </Link>
      </div>
    </div>
  );
};

const FeaturedPosts = () => {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchPost,
  });

  // Show loader while fetching
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader />
      </div>
    );
  }

  // Show an interactive error message if there's an error
  if (error) {
    return (
      <ErrorFallback
        message="Failed to load featured posts. Please try again."
        onRetry={refetch} // Retry fetching data
      />
    );
  }

  const posts = data.posts;
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No featured posts available.
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* SEO Metadata */}
      <Helmet>
        <title>Featured Posts | Cyber Updates</title>
        <meta
          name="description"
          content="Discover the latest featured posts on cybersecurity, tech news, and online safety. Stay updated with the most relevant and engaging content."
        />
        <meta
          name="keywords"
          content="Featured Posts, Cybersecurity, Tech News, Online Safety"
        />
      </Helmet>

      {/* Featured Posts */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Featured Post */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <PostCard post={posts[0]} index="01" layout="vertical" />
        </div>

        {/* Secondary Posts */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {posts.slice(1, 4).map((post, idx) => (
            <PostCard
              key={post._id}
              post={post}
              index={`0${idx + 2}`}
              layout="horizontal"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedPosts;