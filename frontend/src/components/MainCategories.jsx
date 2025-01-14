import { Link } from "react-router-dom";
const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8 ">
      {/* Links */}
      <div className="flex-1 flex items-center flex-wrap gap-4">
        <Link
          to="/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2"
        >
          All Posts
        </Link>
        <Link
          to="/posts?category=cybersecurity"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Cybersecurity
        </Link>
        <Link
          to="/posts?category=ethical-hacking"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Ethical Hacking
        </Link>
        <Link
          to="/posts?category=tech-news"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Tech News
        </Link>
        <Link
          to="/posts?category=tutorial"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          Tutorials
        </Link>
     
       
      </div>
      <span className="text-xl font-medium">|</span>
      {/* Search */}
      <div className="bg-gray-100 p-2 rounded-full flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="gray"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <circle cx="10.5" cy="10.5" r="7.5" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input type="text" placeholder="search blog..." className="bg-transparent" />
      </div>
    </div>
  );
};

export default MainCategories;
