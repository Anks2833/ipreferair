// Import mongoose library to interact with MongoDB
import mongoose from 'mongoose';

// Define a schema for storing search data
const SearchDataSchema = new mongoose.Schema({
    // Reference to the User model, associates search data with a user
    userId: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type
        ref: 'User', // Refers to the 'User' model, establishing a relationship
        required: true, // Ensures userId is provided
    },
    searchType: {
        type: String,
        enum: ['flights', 'stays'],
        required: true,
    },
    origin: String,
    destination: String,
    departureDate: Date,
    returnDate: Date,
    numberOfTravelers: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('SearchData', SearchDataSchema);