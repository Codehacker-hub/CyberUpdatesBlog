import Post from "../models/post.models.js";

// Get all posts
export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};

// Get a single post by slug
export const getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            const error = new Error("Post not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json(post);
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};

// Create a new post
export const createPost = async (req, res, next) => {
    try {
        const newPost = new Post(req.body);
        const post = await newPost.save();
        res.status(201).json(post);
    } catch (error) {
        error.status = 400; // Set status for validation errors
        next(error);
    }
};

// Delete a post by ID
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            const error = new Error("Post not found");
            error.status = 404;
            throw error;
        }
        res.status(200).json({ message: "Post has been deleted" });
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};
