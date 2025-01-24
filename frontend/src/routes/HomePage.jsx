import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, PenSquare } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainCategories from "../components/MainCategories";
import FeaturedPost from "../components/FeaturedPost";
import PostLists from "../components/PostLists";

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SEO Helmet */}
      <Helmet>
        <title>Cyber Updates - Insights to Secure Your Digital Life</title>
        <meta
          name="description"
          content="Explore blogs and articles on cybersecurity, technology, and digital safety. Stay ahead in the cyber world with Cyber Updates."
        />
        <meta
          name="keywords"
          content="cybersecurity, digital safety, technology, blogs, articles, cyber world"
        />
        <meta name="author" content="Cyber Updates" />
        <link rel="canonical" href="https://your-website-url.com" />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-blue-800 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-blue-800 font-medium">Blogs and Articles</span>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-between mb-16">
        {/* Title and Description */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-800 tracking-tight">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
              Cyber Updates Blogs!!
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            Empowering you with insights to secure your digital life and stay
            ahead in the cyber world.
          </p>
        </div>

        {/* Write Button */}
        <Link
          to="/Write"
          className="relative hidden md:flex items-center justify-center w-52 h-52 group"
          aria-label="Write a story"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <PenSquare className="w-8 h-8 text-white" />
            </div>
          </div>
        </Link>
      </div>

      {/* Main Categories */}
      <section className="hidden sm:block mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span>Explore Categories</span>
        </h2>
        <MainCategories />
      </section>

      {/* Featured Posts */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Featured Stories
        </h2>
        <FeaturedPost />
      </section>

      {/* Recent Posts */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recent Posts
        </h2>
        <PostLists />
      </section>
    </div>
  );
};

export default HomePage;
