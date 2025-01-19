import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Get all comments for a specific post
export const getPostComments = async (req, res) => {
  const postId = req.params.postId;

  // Validate postId
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ success: false, message: "Invalid post ID!" });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const comments = await Comment.find({ post: postId })
      .populate("user", "username img")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalComments = await Comment.countDocuments({ post: postId });

    res.status(200).json({ success: true, comments, total: totalComments, page, limit });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching comments", error: error.message });
  }
};

// Add a new comment to a post
export const addComment = async (req, res) => {
  const clerkUserId = req.auth?.userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json({ success: false, message: "You must be logged in to comment!" });
  }

  // Validate postId
  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ success: false, message: "Invalid post ID!" });
  }

  const { desc } = req.body;
  if (typeof desc !== "string" || !desc.trim()) {
    return res.status(400).json({ success: false, message: "Comment cannot be empty!" });
  }

  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    const newComment = new Comment({
      desc: desc.trim(),
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json({ success: true, comment: savedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const clerkUserId = req.auth?.userId;
  const commentId = req.params.id;

  if (!clerkUserId) {
    return res.status(401).json({ success: false, message: "Not authenticated!" });
  }

  try {
    const role = req.auth.sessionClaims?.metadata?.role || "user";

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found!" });
    }

    if (role === "admin") {
      await comment.deleteOne();
      return res.status(200).json({ success: true, message: "Comment has been deleted." });
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    if (!comment.user.equals(user._id)) {
      return res.status(403).json({ success: false, message: "You can only delete your own comment!" });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting comment", error: error.message });
  }
};
