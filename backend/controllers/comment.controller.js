import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

// Get all comments for a specific post
export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username img") // Populate only necessary fields
      .sort({ createdAt: -1 });

    if (!comments) {
      return res.status(404).json("No comments found for this post.");
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

// Add a new comment to a post
export const addComment = async (req, res) => {
  const clerkUserId = req.auth?.userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("You must be logged in to comment!");
  }

  try {
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const { desc } = req.body;

    // Validate the comment content
    if (!desc || desc.trim() === "") {
      return res.status(400).json("Comment cannot be empty!");
    }

    const newComment = new Comment({
      desc,
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const clerkUserId = req.auth?.userId;
  const commentId = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role === "admin") {
      await Comment.findByIdAndDelete(commentId);
      return res.status(200).json("Comment has been deleted.");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      user: user._id,
    });

    if (!deletedComment) {
      return res.status(403).json("You can only delete your own comment!");
    }

    res.status(200).json("Comment deleted.");
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};
