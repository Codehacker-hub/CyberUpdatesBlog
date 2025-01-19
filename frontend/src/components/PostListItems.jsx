import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // For SEO
import { FaTags, FaCalendarAlt } from "react-icons/fa"; // Icons
import Image from "./Image";
import { format } from "timeago.js";

const PostListItems = ({ post }) => {
  return (
    <>
      {/* SEO Enhancements with Helmet */}
      <Helmet>
        <title>{post.title} | Cyber Updates</title>
        <meta
          name="description"
          content={`Read about ${post.title} on Cyber Updates. Stay informed on the latest cybersecurity and tech news.`}
        />
        <meta name="keywords" content={`${post.title}, ${post.category}, cybersecurity, tech news`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={`Read about ${post.title} on Cyber Updates. Stay informed on the latest cybersecurity and tech news.`} />
        <meta property="og:url" content={`${window.location.origin}/${post.slug}`} />
      </Helmet>

      <div className="flex flex-col xl:flex-row gap-6 mb-10">
        {/* Image */}
        {post.img && (
          <div className="w-full xl:w-1/3">
            <Image
              src={post.img}
              className="rounded-lg object-cover w-full h-48 xl:h-auto"
              alt={`Image for ${post.title}`}
              w="735"
            />
          </div>
        )}

        {/* Details */}
        <div className="flex flex-col gap-4 xl:w-2/3">
          {/* Title */}
          <Link
            to={`/${post.slug}`}
            className="text-2xl md:text-3xl font-bold text-gray-800 hover:underline"
          >
            {post.title}
          </Link>

          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
            <span>Written by</span>
            <Link
              className="text-blue-600 hover:underline"
              to={`/posts?author=${post.user.username}`}
            >
              {post.user.username}
            </Link>
            <span>on</span>
            <Link
              className="text-blue-600 hover:underline"
              to={`/posts?category=${post.category}`}
            >
              <FaTags className="inline-block mr-1" />
              {post.category}
            </Link>
            <span>
              <FaCalendarAlt className="inline-block mr-1" />
              {format(post.createdAt)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-base line-clamp-3">{post.desc}</p>

          {/* Read More Link */}
          <Link
            to={`/${post.slug}`}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Read More
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostListItems;
