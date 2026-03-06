import app from "./app.js";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// For traditional server environments (local dev)
if (process.env.NODE_ENV !== "production") {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running in development mode on port ${PORT}`);
        });
    });
} else {
    // For Vercel serverless: connect on each invocation (cached)
    app.use(async (req, res, next) => {
        try {
            await connectDB();
            next();
        } catch (err) {
            res.status(500).json({ message: "Database connection failed", error: err.message });
        }
    });
}

export default app;
