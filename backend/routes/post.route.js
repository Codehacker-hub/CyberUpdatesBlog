import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Define the routes with corrected controller usage
router.get("/", getPosts); // GET all posts
router.get("/:slug", getPost); // GET a single post by slug
router.post("/", createPost); // CREATE a post
router.delete("/:id", deletePost); 

export default router;
