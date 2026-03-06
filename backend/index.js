import app from "./app.js";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// For Vercel Serverless: ensure DB is connected before handling any request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB Connection Error in Middleware:", err);
        res.status(500).json({
            message: "Database connection failed",
            error: err.message,
            hint: "Check if MONGODB_URI environment variable is set in Vercel, and ensure Atlas Network Access allows 0.0.0.0/0"
        });
    }
});

// For local development only
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running in development mode on port ${PORT}`);
    });
}

export default app;

