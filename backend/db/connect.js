import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("Please define MONGODB_URI in .env");
        }

        cached.promise = mongoose.connect(uri).then((mongoose) => mongoose);
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
    } catch (error) {
        cached.promise = null;
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
    }

    return cached.conn;
};

export default connectDB;