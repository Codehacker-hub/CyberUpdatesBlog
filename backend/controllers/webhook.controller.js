import { Webhook } from "svix";
import User from "../models/user.model.js";

/**
 * Handle Clerk webhook events
 * This function processes incoming webhooks from Clerk and handles events like user creation and deletion.
 */
export const clerkWebHook = async (req, res) => {
  // Fetch the webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // Ensure the Webhook Secret is configured
  if (!WEBHOOK_SECRET) {
    return res.status(500).json({
      message: "Server misconfiguration: Webhook secret is missing.",
    });
  }

  const payload = req.body; // Raw body payload from the request
  const headers = req.headers; // Headers used for webhook verification

  // Initialize the Svix Webhook instance
  const webhook = new Webhook(WEBHOOK_SECRET);
  let event;

  try {
    // Verify the webhook payload using Svix
    // `tolerance` ensures the webhook request is within a valid time window
    event = webhook.verify(payload, headers, { tolerance: 600 });
  } catch (error) {
    // Return a 400 response for invalid or unverified webhooks
    return res.status(400).json({
      message: "Webhook verification failed.",
      error: error.message,
    });
  }

  // Process the webhook event
  try {
    switch (event.type) {
      /**
       * Handle the "user.created" event
       * This event is triggered when a new user is created in Clerk.
       */
      case "user.created": {
        const username =
          event.data.username || event.data.email_addresses[0]?.email_address;

        // Check if a user with the same username already exists in the database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          // Log the existence of the user for debugging purposes
          return res
            .status(200)
            .json({ message: `User with username '${username}' already exists.` });
        }

        // Create and save a new user in the database
        const newUser = new User({
          clerkUserId: event.data.id,
          username,
          email: event.data.email_addresses[0]?.email_address,
          img: event.data.profile_image_url,
          created_at: event.data.created_at,
          updated_at: event.data.updated_at,
        });

        await newUser.save();
        return res
          .status(201)
          .json({ message: "New user created successfully." });
      }

      /**
       * Handle the "user.deleted" event
       * This event is triggered when a user is deleted in Clerk.
       */
      case "user.deleted": {
        // Delete the user from the database using the Clerk user ID
        const deletedUser = await User.deleteOne({ clerkUserId: event.data.id });

        if (deletedUser.deletedCount > 0) {
          // User deleted successfully
          return res
            .status(200)
            .json({ message: "User deleted successfully from the database." });
        } else {
          // User not found in the database
          return res.status(404).json({
            message: `No user found with Clerk ID '${event.data.id}'.`,
          });
        }
      }

      /**
       * Handle other events
       * Log unhandled events for debugging and monitoring purposes.
       */
      default: {
        return res.status(200).json({
          message: `Unhandled event type: '${event.type}'. No action taken.`,
        });
      }
    }
  } catch (error) {
    // Handle database or processing errors
    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(409).json({
        message: "Duplicate key error: User with the same unique identifier already exists.",
      });
    }

    // Log and return any other errors that occur
    return res.status(500).json({
      message: "Internal server error occurred while processing the webhook.",
      error: error.message,
    });
  }
};