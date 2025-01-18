import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
} from "../controllers/post.controller.js";
import IncreaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

// Define the routes with corrected controller usage
router.get("/upload-auth", uploadAuth);
router.get("/", getPosts); // GET all posts
router.get("/:slug", IncreaseVisit, getPost); // GET a single post by slug
router.post("/", createPost); // CREATE a post
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);

export default router;
