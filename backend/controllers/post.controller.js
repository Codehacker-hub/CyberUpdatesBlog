import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

/**
 * Fetch posts with filters, sorting, and pagination
 */
export const getPosts = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1); // Default to page 1
  const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Limit to a max of 100 posts per request

  const query = {};
  const { cat, author, search, sort, featured } = req.query;

  // Filter by category
  if (cat) query.category = cat;

  // Search by title (case-insensitive)
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  // Filter by author
  if (author) {
    const user = await User.findOne({ username: author }).select("_id");
    if (!user) {
      return res
        .status(404)
        .json({ message: "No posts found for the given author." });
    }
    query.user = user._id;
  }

  // Filter featured posts
  if (featured) query.isFeatured = true;

  // Sorting logic
  let sortObj = { createdAt: -1 }; // Default: sort by newest
  if (sort) {
    switch (sort) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Posts from the last 7 days
        };
        break;
      default:
        break;
    }
  }

  try {
    // Fetch posts with pagination and user population
    const posts = await Post.find(query)
      .populate("user", "username")
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit);

    // Get total post count for pagination
    const totalPosts = await Post.countDocuments(query);
    const hasMore = page * limit < totalPosts;

    res.status(200).json({ posts, hasMore });
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching posts." });
  }
};

/**
 * Fetch a single post by slug
 */
export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "user",
      "username img"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

/**
 * Create a new post
 */
export const createPost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    // Check if user is authenticated
    if (!clerkUserId) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    // Find the user in the database
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Generate a unique slug for the post
    let slug = req.body.title
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase();

    let existingPost = await Post.findOne({ slug });
    let counter = 2;
    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    // Create and save the new post
    const newPost = new Post({ user: user._id, slug, ...req.body });
    const post = await newPost.save();

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
};

/**
 * Delete a post
 */
export const deletePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    // Check if user is authenticated
    if (!clerkUserId) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    // Check user's role
    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role === "admin") {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Post has been deleted" });
    }

    // Check if the user owns the post
    const user = await User.findOne({ clerkUserId });
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    });

    if (!deletedPost) {
      return res
        .status(403)
        .json({ message: "You can delete only your posts!" });
    }

    res.status(200).json({ message: "Post has been deleted" });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: "An error occurred while deleting the post" });
  }
};

/**
 * Feature or unfeature a post
 */
export const featurePost = async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const postId = req.body.postId;

    // Check if user is authenticated
    if (!clerkUserId) {
      return res.status(401).json({ message: "Not authenticated!" });
    }

    // Check if user has admin privileges
    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({ message: "You cannot feature posts!" });
    }

    // Toggle the 'isFeatured' status of the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isFeatured: !post.isFeatured },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error featuring post:", error.message);
    res.status(500).json({ error: "An error occurred while featuring the post" });
  }
};

/**
 * Generate authentication parameters for image upload
 */
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error generating upload auth:", error.message);
    res.status(500).json({ error: "An error occurred while generating auth" });
  }
};