import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const fetchComments = async (postId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${postId}`
  );
  return res.data;
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch comments
  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  // Mutation to post a comment
  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment added successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to add comment");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc");

    // Prevent empty comments
    if (!desc.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    mutation.mutate({ desc });
    e.target.reset(); // Clear input after submission
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between gap-8 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl border border-gray-300"
          disabled={mutation.isLoading}
        />
        <button
          type="submit"
          className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Sending..." : "Send"}
        </button>
      </form>

      {/* Comments Section */}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p className="text-red-500">Error loading comments!</p>
      ) : (
        <>
          {/* Optimistic UI for new comment */}
          {mutation.isLoading && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date().toISOString(),
                user: {
                  img: user?.imageUrl || null,
                  username: user?.username || "Anonymous",
                },
              }}
            />
          )}

          {/* Render comments */}
          {data.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
