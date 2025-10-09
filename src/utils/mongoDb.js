import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri);
let database;

// Function to extract database name from MongoDB URI
const getDatabaseNameFromUri = (uri) => {
    try {
        const url = new URL(uri);
        // Remove leading slash and get the pathname (database name)
        const dbName = url.pathname.substring(1);
        return dbName || 'default'; // Return 'default' if no database name in URI
    } catch (error) {
        console.error('Error parsing MongoDB URI:', error);
        return 'default';
    }
};

// Initialize database connection once
export const initializeDatabase = async () => {
    try {
        await client.connect();
        const dbName = getDatabaseNameFromUri(uri);
        database = client.db(dbName);
        console.log(`✅ MongoDB connected to database: ${dbName}`);
        return database;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
};

// Get the already initialized database (no async needed)
export const getDb = () => {
    if (!database) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return database;
};
