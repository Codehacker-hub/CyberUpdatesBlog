import React from 'react';
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FaUser, FaTags, FaCalendarAlt, FaEye, FaFacebookF, FaInstagram } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import ErrorFallback from '../components/ErrorFallback';

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const MetaInfo = ({ icon: Icon, label, value, className }) => (
  <div className="flex items-center gap-2 group relative">
    <Icon className={`${className} w-4 h-4`} />
    <span className="text-gray-600">{value}</span>
    <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 whitespace-nowrap">
      {label}
    </div>
  </div>
);

const CategoryLink = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full transition-all ${
      isActive 
        ? "bg-blue-100 text-blue-800 font-medium" 
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
  </button>
);

const SinglePostPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  const isCategoryActive = (category) => searchParams.get("cat") === category;

  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({ ...Object.fromEntries(searchParams.entries()), cat: category });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error) {
   
    return (
      <ErrorFallback
        className="min-h-screen flex justify-center items-center"
        message="Failed to load Post. Please try again."
        onRetry={refetch} // Retry fetching data
      />
    );
  }

  if (!data) return "Post not found!";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>{data.title} | YourSiteName</title>
        <meta name="description" content={data.desc} />
        <meta name="keywords" content={data.tags?.join(", ")} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.desc} />
        <meta property="og:image" content={data.img || "default-image-url.jpg"} />
        <meta property="og:url" content={`${import.meta.env.VITE_SITE_URL}/posts/${slug}`} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`${import.meta.env.VITE_SITE_URL}/posts/${slug}`} />
        <style>
          {`
            .post-content h1 { @apply text-3xl font-bold mt-8 mb-4; }
            .post-content h2 { @apply text-2xl font-bold mt-6 mb-4; }
            .post-content h3 { @apply text-xl font-bold mt-6 mb-3; }
            .post-content h4 { @apply text-lg font-bold mt-4 mb-2; }
            .post-content h5 { @apply text-base font-bold mt-4 mb-2; }
            .post-content h6 { @apply text-sm font-bold mt-4 mb-2; }
            .post-content p { @apply text-base leading-7 mb-4; }
            .post-content ul { @apply list-disc pl-6 mb-4; }
            .post-content ol { @apply list-decimal pl-6 mb-4; }
            .post-content li { @apply mb-2; }
            .post-content img { @apply max-w-full h-auto rounded-lg my-4; }
            .post-content pre { @apply bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto; }
            .post-content code { @apply bg-gray-100 px-1 py-0.5 rounded; }
            .post-content blockquote { @apply border-l-4 border-gray-300 pl-4 my-4 italic; }
          `}
        </style>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: data.title,
            description: data.desc,
            author: {
              "@type": "Person",
              name: data.user.username,
            },
            datePublished: data.createdAt,
            image: data.img || "default-image-url.jpg",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${import.meta.env.VITE_SITE_URL}/posts/${slug}`,
            },
          })}
        </script>
      </Helmet>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            {data.img && (
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image 
                  src={data.img} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {data.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm relative">
              <MetaInfo 
                icon={FaUser} 
                label="Author" 
                value={data.user.username}
                className="text-blue-600"
              />
              <MetaInfo 
                icon={FaTags} 
                label="Category" 
                value={data.category}
                className="text-green-600"
              />
              <MetaInfo 
                icon={FaCalendarAlt} 
                label="Published" 
                value={format(data.createdAt)}
                className="text-orange-600"
              />
              <MetaInfo 
                icon={FaEye} 
                label="Views" 
                value={data.visit}
                className="text-purple-600"
              />
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {data.desc}
            </p>
          </div>

          {/* Article Content */}
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t">
            <Comments postId={data._id} />
          </div>
        </div>

        {/* Sidebar - Fixed */}
        <div className="lg:block">
          <div className="sticky top-8 space-y-8">
            {/* Author Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">About the Author</h2>
              <div className="flex items-center gap-4 mb-4">
                {data.user.img ? (
                  <img
                    src={data.user.img}
                    className="w-16 h-16 rounded-full object-cover"
                    alt={data.user.username}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-lg">{data.user.username}</h3>
                  <div className="flex gap-2 mt-2">
                    <Link className="text-gray-600 hover:text-blue-600">
                      <FaFacebookF className="w-5 h-5" />
                    </Link>
                    <Link className="text-gray-600 hover:text-pink-600">
                      <FaInstagram className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
              <PostMenuActions post={data} />
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                <CategoryLink 
                  category="all" 
                  isActive={!searchParams.get("cat")}
                  onClick={() => setSearchParams({})}
                />
                {[
                  "general",
                  "cyber-security",
                  "ethical-hacking",
                  "tech-news",
                  "tutorial",
                ].map((category) => (
                  <CategoryLink
                    key={category}
                    category={category}
                    isActive={isCategoryActive(category)}
                    onClick={() => handleCategoryChange(category)}
                  />
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Search Posts</h2>
              <Search />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;