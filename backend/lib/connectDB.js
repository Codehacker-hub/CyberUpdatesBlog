import mongoose from "mongoose";

// Function to connect to the MongoDB database
const connectDB = async () => {
  // Retrieve the MongoDB URI from environment variables
  const uri = process.env.MONGODB_URI;

  // Throw an error if the URI is not defined
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
  }

  try {
    // Connect to the database using the mongoose library
    await mongoose.connect(uri);

    // Log a success message only in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB connected successfully");
    }
  } catch (err) {
    // Log the error only in non-production environments
    if (process.env.NODE_ENV !== "production") {
      console.error("Error connecting to MongoDB:", err);
    }

    // Gracefully exit the process with a failure code (1)
    process.exit(1);
  }
};

export default connectDB;
