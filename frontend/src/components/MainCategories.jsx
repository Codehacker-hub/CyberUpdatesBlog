import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Search from "./Search";

const MainCategories = () => {
  const location = useLocation();

  const categories = [
    { name: "All Posts", path: "/posts", param: "" },
    { name: "Cybersecurity", path: "/posts?category=cyber-security", param: "cyber-security" },
    { name: "Ethical Hacking", path: "/posts?category=ethical-hacking", param: "ethical-hacking" },
    { name: "Tech News", path: "/posts?category=tech-news", param: "tech-news" },
    { name: "Tutorials", path: "/posts?category=tutorial", param: "tutorial" },
  ];

  const isActive = (param) => {
    if (!param) {
      return location.pathname === "/posts" && !location.search;
    }
    return location.search.includes(`category=${param}`);
  };

  return (
    <div className="hidden md:flex flex-col lg:flex-row gap-4 bg-white rounded-2xl shadow-lg p-2">
      {/* SEO Helmet */}
      <Helmet>
        <title>Explore Categories - Cyber Updates</title>
        <meta
          name="description"
          content="Browse categories like Cybersecurity, Ethical Hacking, Tech News, and Tutorials on Cyber Updates. Find articles tailored to your interests."
        />
        <meta
          name="keywords"
          content="Cybersecurity, Ethical Hacking, Tech News, Tutorials, Categories"
        />
      </Helmet>

      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2 p-2 flex-grow">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={category.path}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 ease-in-out
              ${isActive(category.param)
                ? "bg-blue-800 text-white shadow-md hover:bg-blue-700"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              }
            `}
          >
            {category.name}
            {isActive(category.param) && (
              <span className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20" />
            )}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="hidden lg:flex items-center px-2">
        <div className="h-8 w-px bg-gray-200" />
      </div>

      {/* Search */}
      <div className="p-2 lg:ml-auto">
        <Search />
      </div>
    </div>
  );
};

export default MainCategories;
