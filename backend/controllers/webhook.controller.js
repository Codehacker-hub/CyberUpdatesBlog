import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook Secret is missing!");
  }

  const payload = req.body;
  const headers = req.headers;

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    // Verifying the webhook payload
    evt = await wh.verify(payload, headers, { tolerance: 600 });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).json({ message: "Webhook verification failed!" });
  }

  
  try {
    if (evt.type === "user.created") {
      const username =
        evt.data.username || evt.data.email_addresses[0]?.email_address;

      // Check for existing user
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log("User with this username already exists:", username);
      } else {
        // Save new user
        const newUser = new User({
          clerkUserId: evt.data.id,
          username,
          email: evt.data.email_addresses[0]?.email_address,
          img: evt.data.profile_image_url,
          created_at: evt.data.created_at,
          updated_at: evt.data.updated_at,
        });

        await newUser.save();
        console.log("New user saved:", newUser);
      }
    } else if (evt.type === "user.deleted") {
      const deletedUser = await User.deleteOne({ clerkUserId: evt.data.id });
      console.log("User deleted:", deletedUser);
    }
  } catch (error) {
    if (error.code === 11000) {
      console.error("Duplicate key error:", error);
    } else {
      console.error("Error processing event:", error);
    }
    return res.status(500).json({ message: "Internal server error!" });
  }

  res.status(200).json({ message: "Webhook processed successfully!" });
};
