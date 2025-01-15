import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import connectDB from "./lib/connectDB.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

// Clerk middleware

app.use(clerkMiddleware());
app.use("/webhooks", webhookRouter);
// Middleware to parse JSON requests
app.use(express.json());

// app.get("/auth-state", (req,res)=>{
//   const authstate = req.auth;
//   res.json({authstate});                     
// })


// app.get("/protect", (req, res) => {
//   const { userId } = req.auth;
//   if (!userId) {
//     res.status(401).json({ error: "Unauthorized" });
//   }
//   res.status(200).json({ userId });
// });

app.get("/protect2", requireAuth(), (req, res) => {
  const { userId } = req.auth;
  res.status(200).json({ userId });
});

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
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB(); // Connect to the database
});
