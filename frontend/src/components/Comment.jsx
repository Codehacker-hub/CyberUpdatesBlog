import { format } from "timeago.js";
import Image from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const Comment = ({ comment, postId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully.");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete comment. Please try again."
      );
    },
  });

  return (
    <div className="p-4 bg-gray-50 rounded-xl mb-8 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        {comment.user.img ? (
          <img
            src={comment.user.img}
            alt={`${comment.user.username}'s avatar`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        )}

        {/* User Information */}
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {comment.user.username}
          </span>
          <span className="text-sm text-gray-500">
            {format(comment.createdAt)}
          </span>
        </div>

        {/* Delete Button */}
        {user &&
          (comment.user.username === user.username || role === "admin") && (
            <button
              className="ml-auto text-xs text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              onClick={() => mutation.mutate()}
              disabled={mutation.isLoading}
              aria-label="Delete comment"
            >
              {mutation.isLoading ? "Deleting..." : "Delete"}
            </button>
          )}
      </div>

      {/* Comment Content */}
      <div className="mt-4">
        <p className="text-gray-700">{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;
