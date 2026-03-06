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
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            serverApi: {
                version: "1",
                strict: true,
                deprecationErrors: true,
            },
        }).then((m) => m);
    }

    try {
        cached.conn = await cached.promise;
        console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
    } catch (error) {
        cached.promise = null;
        console.error(`MongoDB connection error: ${error.message}`);
        throw new Error(`MongoDB connection failed: ${error.message}`);
    }

    return cached.conn;
};

export default connectDB;
