// Import necessary modules
import express from "express"; // Express framework for building web applications
import mongoose from "mongoose"; // Mongoose for interacting with MongoDB
import userRoutes from "./routes/user.route.js"; // Routes for user-related operations
import authRoutes from "./routes/auth.route.js"; // Routes for authentication
import uploadRoutes from "./routes/upload.routes.js"; // Routes for file uploads
import cookieParser from "cookie-parser"; // Middleware to parse cookies
import flightSearchRoutes from "./routes/flight.route.js"; // Routes for flight search functionality
import path from "path"; // Node.js module for handling file paths
import cors from "cors"; // Import CORS for cross-origin requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) // Use MongoDB connection string from .env file
  .then(() => {
    console.log("MongoDB is connected"); // Log successful connection
  })
  .catch((err) => {
    console.log(err); // Log errors if connection fails
  });

// Resolve the directory name for static file serving
const __dirname = path.resolve();

// Initialize the Express app
const app = express();

// Configure CORS options
const corsOptions = {
  origin: "*", // Allow requests from CLIENT_URL or all origins if not specified
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
};

// Middleware setup
app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies for request handling
app.use(express.urlencoded({ extended: true }));

// Define API routes
app.use("/api/user", userRoutes); // User-related API routes
app.use("/api/auth", authRoutes); // Authentication API routes
app.use("/api", uploadRoutes); // File upload API routes
app.use("/api/flight", flightSearchRoutes); // Flight search API routes

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`); // Log server start message with template literal
});

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, "/client/build")));

// Handle all other routes and serve the React frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html")); // Serve the React app for any route
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
  const message = err.message || "Internal Server Error"; // Default error message
  res.status(statusCode).json({
    success: false,
    statusCode, // Return the status code
    message, // Return the error message
  });
});
