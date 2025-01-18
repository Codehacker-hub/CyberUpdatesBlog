import { Link, useLocation } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  const location = useLocation();

  const isActive = (category) =>
    location.search.includes(`category=${category}`);

  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
      {/* Links */}
      <div className="flex-1 flex items-center flex-wrap gap-4">
        <Link
          to="/posts"
          className={`${
            location.pathname === "/posts" && !location.search
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          } rounded-full px-4 py-2`}
        >
          All Posts
        </Link>
        <Link
          to="/posts?category=cyber-security"
          className={`${
            isActive("cyber-security") ? "bg-blue-800 text-white" : "hover:bg-blue-50"
          } rounded-full px-4 py-2`}
        >
          Cybersecurity
        </Link>
        <Link
          to="/posts?category=ethical-hacking"
          className={`${
            isActive("ethical-hacking") ? "bg-blue-800 text-white" : "hover:bg-blue-50"
          } rounded-full px-4 py-2`}
        >
          Ethical Hacking
        </Link>
        <Link
          to="/posts?category=tech-news"
          className={`${
            isActive("tech-news") ? "bg-blue-800 text-white" : "hover:bg-blue-50"
          } rounded-full px-4 py-2`}
        >
          Tech News
        </Link>
        <Link
          to="/posts?category=tutorial"
          className={`${
            isActive("tutorial") ? "bg-blue-800 text-white" : "hover:bg-blue-50"
          } rounded-full px-4 py-2`}
        >
          Tutorials
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* Search */}
      <Search />
    </div>
  );
};

export default MainCategories;
