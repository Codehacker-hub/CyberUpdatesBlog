import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * Get all comments for a specific post
 */
export const getPostComments = async (req, res) => {
  const postId = req.params.postId;

  // Validate postId
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid post ID!" });
  }

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1); // Ensure page is at least 1
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Cap limit to 100

    // Fetch comments with pagination
    const comments = await Comment.find({ post: postId })
      .populate("user", "username img") // Populate user info
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit) // Pagination: skip previous pages
      .limit(limit) // Limit results per page
      .lean(); // Return plain objects for better performance

    // Count total comments for the post
    const totalComments = await Comment.countDocuments({ post: postId });

    res.status(200).json({
      success: true,
      comments,
      total: totalComments, // Total number of comments for pagination
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

/**
 * Add a new comment to a post
 */
export const addComment = async (req, res) => {
  const clerkUserId = req.auth?.userId; // Authenticated user's ID
  const postId = req.params.postId;

  // Check if user is authenticated
  if (!clerkUserId) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in to comment!",
    });
  }

  // Validate postId
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid post ID!" });
  }

  const { desc } = req.body;

  // Validate comment description
  if (typeof desc !== "string" || !desc.trim()) {
    return res.status(400).json({
      success: false,
      message: "Comment cannot be empty!",
    });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Create and save a new comment
    const newComment = new Comment({
      desc: desc.trim(),
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully!",
      comment: savedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (req, res) => {
  const clerkUserId = req.auth?.userId; // Authenticated user's ID
  const commentId = req.params.id;

  // Check if user is authenticated
  if (!clerkUserId) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated!",
    });
  }

  try {
    // Check user's role (default to "user")
    const role = req.auth?.sessionClaims?.metadata?.role || "user";

    // Find the comment in the database
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found!" });
    }

    // Admins can delete any comment
    if (role === "admin") {
      await comment.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Comment has been deleted.",
      });
    }

    // Find the user in the database
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Restrict users to delete only their own comments
    if (!comment.user.equals(user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment!",
      });
    }

    // Delete the comment
    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message,
    });
  }
};