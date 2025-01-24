import User from "../models/user.model.js";

/**
 * Fetch saved posts for the authenticated user
 */
export const getUserSavedPosts = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json({ message: "User not authenticated!" });
    }

    const role = req.auth?.sessionClaims?.metadata?.role;
    if (role === "admin") {
      return res.status(403).json({
        message: "Admins are not allowed to fetch saved posts!",
      });
    }

    const user = await User.findOne({ clerkUserId }).select("savedPosts");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Ensure `savedPosts` is always an array
    return res.status(200).json({ savedPosts: user.savedPosts || [] });
  } catch (error) {
    console.error(`[getUserSavedPosts] Error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error." });
  }
};


/**
 * Save or unsave a post for the authenticated user
 */
export const savePost = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    const { postId } = req.body;

    // Check if user is authenticated
    if (!clerkUserId) {
      return res.status(401).json({ message: "User not authenticated!" });
    }

    // Validate postId
    if (!postId || typeof postId !== "string") {
      return res.status(400).json({ message: "Invalid postId provided!" });
    }

    // Find the user in the database
    const user = await User.findOne({ clerkUserId });

    // Handle case where user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Prevent admin users from saving posts
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot save posts!" });
    }

    // Check if the post is already saved
    const isPostAlreadySaved = user.savedPosts?.includes(postId);

    // Add or remove the postId from user's savedPosts array
    if (isPostAlreadySaved) {
      user.savedPosts = user.savedPosts.filter((id) => id !== postId);
    } else {
      user.savedPosts.push(postId);
    }

    // Save the updated user document
    await user.save();

    // Respond with a success message
    return res
      .status(200)
      .json({ message: isPostAlreadySaved ? "Post unsaved" : "Post saved" });
  } catch (error) {
    console.error("Error saving post:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};