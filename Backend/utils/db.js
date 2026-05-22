import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  try {
<<<<<<< HEAD
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/job-portal";
    await mongoose.connect(MONGO_URI, {
      bufferTimeoutMS: 30000, // Increase buffer timeout to 30 seconds
      serverSelectionTimeoutMS: 30000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
      maxPoolSize: 10, // Maximum pool size
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.log("Continuing without database connection...");
    // Don't exit, continue running the server
    // process.exit(1);
=======
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  }
};

export default connectDB;
