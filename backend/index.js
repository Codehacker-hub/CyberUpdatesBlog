import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import connectDB from "./lib/connectDB.js";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Route registration
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong!",
    status: error.status || 500,
    // Remove the stack trace in production for security
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  connectDB(); // Connect to the database
  console.log(`Server is running on http://localhost:${PORT}`);
});
