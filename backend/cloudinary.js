// Import necessary modules
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary v2 for managing cloud-based media

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
});

// Export the configured Cloudinary instance for use in other parts of the application
export default cloudinary;