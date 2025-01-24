import React from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BookmarkIcon, StarIcon, Trash2Icon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import ErrorFallback from "./ErrorFallback";

// Create base styled components to replace shadcn/ui
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({
  children,
  variant = "outline",
  className = "",
  disabled = false,
  onClick,
}) => {
  const variants = {
    outline: "border border-gray-200 hover:bg-gray-50",
    secondary: "bg-gray-100 hover:bg-gray-200",
    destructive: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const Separator = () => <div className="h-px bg-gray-200 w-full" />;

const Alert = ({ children, className = "" }) => (
  <div
    className={`bg-red-50 border border-red-200 text-red-700 p-4 rounded-md ${className}`}
  >
    {children}
  </div>
);

const PostMenuActions = ({ post }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  // Only fetch saved posts if the user is not an admin
  const { isPending, error, data: savedPosts, refetch } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      if (isAdmin) return []; // Skip fetching saved posts for admins
      const token = await getToken();
      return axios
        .get(`${import.meta.env.VITE_API_URL}/users/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data.savedPosts || []); // Ensure it's always an array
    },
    enabled: !isAdmin, // Skip query for admin role
  });

  // Fix: Ensure savedPosts is always treated as an array
  const isSaved = Array.isArray(savedPosts) && savedPosts.some((p) => p === post._id);
  const canDelete =
    user && (post.user.username === user.username || isAdmin);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      navigate("/");
    },
    onError: (error) => toast.error(error.response.data),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/users/save`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] }),
    onError: (error) => toast.error(error.response.data),
  });

  const featureMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/feature`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["post", post.slug] }),
    onError: (error) => toast.error(error.response.data),
  });

  const handleSave = () => {
    if (!user) return navigate("/login");
    saveMutation.mutate();
  };

  if (error) {
    return (
      <ErrorFallback
        message="Something went wrong! Please try again."
        onRetry={refetch} // Retry fetching data
      />
    );
  }

  return (
    <Card className="mt-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Post Actions</h2>
        <div className="space-y-2">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            className="w-full justify-start gap-2"
            onClick={handleSave}
            disabled={isPending || saveMutation.isPending}
          >
            <BookmarkIcon
              className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
            />
            {isSaved ? "Saved" : "Save Post"}
            {saveMutation.isPending && (
              <span className="text-xs ml-2">(saving...)</span>
            )}
          </Button>

          {isAdmin && (
            <Button
              variant={post.isFeatured ? "secondary" : "outline"}
              className="w-full justify-start gap-2"
              onClick={() => featureMutation.mutate()}
              disabled={featureMutation.isPending}
            >
              <StarIcon
                className={`h-4 w-4 ${post.isFeatured ? "fill-current" : ""}`}
              />
              {post.isFeatured ? "Featured" : "Feature Post"}
              {featureMutation.isPending && (
                <span className="text-xs ml-2">(updating...)</span>
              )}
            </Button>
          )}

          {canDelete && (
            <>
              <Separator />
              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete Post
                {deleteMutation.isPending && (
                  <span className="text-xs ml-2">(deleting...)</span>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostMenuActions;
