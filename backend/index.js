import app from "./app.js";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initiate DB connection immediately at module load time.
// For Vercel: the promise is cached globally, so connection is reused across invocations.
// Mongoose will buffer queries until the connection is ready.
connectDB().catch((err) => console.error("Initial DB connection failed:", err.message));

// For local development: start the HTTP server
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server is running in development mode on port ${PORT}`);
    });
}

export default app;
