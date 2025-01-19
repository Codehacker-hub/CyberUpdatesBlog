import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      if (query) {
        if (location.pathname === "/posts") {
          setSearchParams({
            ...Object.fromEntries(searchParams),
            search: query,
          });
        } else {
          navigate(`/posts?search=${query}`);
        }
      }
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (location.pathname === "/posts") {
      const params = Object.fromEntries(searchParams);
      delete params.search;
      setSearchParams(params);
    }
  };

  return (
    <div className="relative group">
      <div
        className="relative flex items-center bg-gray-50 rounded-full 
                    shadow-sm hover:shadow transition-shadow duration-200
                    focus-within:shadow-md focus-within:ring-2 
                    focus-within:ring-blue-100 focus-within:ring-offset-1"
      >
        <SearchIcon
          className="absolute left-3 h-4 w-4 text-gray-400 
                             group-hover:text-gray-500 transition-colors"
        />

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search posts..."
          className="w-full min-w-[240px] pl-10 pr-8 py-2.5 
                    text-sm text-gray-700 placeholder-gray-400
                    bg-transparent rounded-full
                    border border-gray-200
                    focus:outline-none focus:border-blue-300
                    transition-all duration-200"
          onKeyDown={handleKeyPress}
        />

        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-0.5 rounded-full
                     text-gray-400 hover:text-gray-600
                     hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Instructions */}
      <div
        className="absolute top-full left-0 right-0 mt-1.5 p-2
                    text-xs text-gray-500 bg-white rounded-lg shadow-lg
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200"
      >
        Press Enter to search
      </div>
    </div>
  );
};

export default Search;
