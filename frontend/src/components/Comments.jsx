import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import Loader from "./Loader";

const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  
  // Handle both array and wrapped object responses
  if (Array.isArray(res.data)) {
    return res.data;
  }
  return res.data.comments || [];
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
      toast.error(
        error.response?.data?.message || "Failed to add comment. Please try again."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc");

    if (!desc.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    mutation.mutate({ desc });
    e.target.reset();
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl font-semibold text-gray-800 underline">Comments</h1>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4 w-full"
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={3}
          aria-label="Write a comment"
          disabled={mutation.isLoading}
        />
        <button
          type="submit"
          className="bg-blue-800 px-6 py-3 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? (
            <Loader small={true} />
          ) : (
            "Send"
          )}
        </button>
      </form>

      {/* Comments Section */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">
          {error?.response?.data?.message || "Error loading comments. Please try again later."}
        </p>
      ) : Array.isArray(data) && data.length === 0 ? (
        <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
      ) : (
        <>
          {/* Optimistic UI */}
          {mutation.isLoading && mutation.variables?.desc && (
            <Comment
              comment={{
                desc: mutation.variables.desc + " (Sending...)",
                createdAt: new Date().toISOString(),
                user: {
                  img: user?.profileImageUrl || null,
                  username: user?.username || "Anonymous",
                },
              }}
            />
          )}

          {/* Render Comments */}
          {Array.isArray(data) && data.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;
