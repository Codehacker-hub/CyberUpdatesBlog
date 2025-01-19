import React from "react";
import PostListItems from "./PostListItems";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import Loader from "./Loader";
import ErrorFallback from "./ErrorFallback";

const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostLists = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch, // This function allows retrying the query
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // Show loader while fetching
  if (isFetching) {
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
        message="Oops! Unable to load posts. Please try again."
        onRetry={refetch} // Retry fetching data
      />
    );
  }

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="text-center flex justify-center items-center h-32">
          <Loader />
        </div>
      }
      endMessage={
        <div className="text-center py-6">
          <p className="text-gray-600 text-lg">
            <b>🎉 You've reached the end! 🎉</b>
          </p>
          <p className="text-gray-500">
            No more posts to load. Check back later for new content!
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 px-4">
        {allPosts.map((post) => (
          <PostListItems key={post._id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PostLists;