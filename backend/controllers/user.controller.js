import User from "../models/user.model.js";
export const getUserSavedPosts = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    // Access the role from metadata
    const role = req.auth.sessionClaims?.metadata?.role;

    // If the user is an admin, don't fetch saved posts
    if (role === "admin") {
      return res
        .status(403)
        .json("Admins are not allowed to fetch saved posts!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.status(200).json(user.savedPosts || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;

    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Prevent admin users from saving posts
    if (user.role === "admin") {
      return res.status(403).json("Admins cannot save posts!");
    }

    const isSaved = user.savedPosts?.some((p) => p === postId);

    if (!isSaved) {
      await User.findByIdAndUpdate(user._id, {
        $push: { savedPosts: postId },
      });
    } else {
      await User.findByIdAndUpdate(user._id, {
        $pull: { savedPosts: postId },
      });
    }

    res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
