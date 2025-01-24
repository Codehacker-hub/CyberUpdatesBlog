import Post from "../models/post.model.js";

/**
 * Middleware to increment the visit count of a post based on its slug,
 * ensuring that multiple views from the same user are not counted.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - Callback to pass control to the next middleware
 */
const IncreaseVisit = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Validate slug
    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ message: "Invalid slug parameter provided." });
    }

    // Get user identifier (user ID if logged in, otherwise fallback to IP)
    const userId = req.auth?.userId || req.ip;

    // Ensure userId exists (for fallback cases)
    if (!userId) {
      return res.status(400).json({ message: "Could not determine user identity." });
    }

    // Check if the user has already visited the post
    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // If user has already visited, skip incrementing
    if (post.visitedBy.includes(userId)) {
      return next(); // User already visited, proceed without incrementing
    }

    // Increment visit count and add user to visitedBy array
    post.visit += 1;
    post.visitedBy.push(userId);

    // Save the updated post
    await post.save();

    next(); // Pass control to the next middleware
  } catch (error) {
    // Log errors in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in IncreaseVisit middleware:", error.message);
    }

    // Return a generic error message to the client
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

export default IncreaseVisit;
