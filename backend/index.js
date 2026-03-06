import app from "./app.js";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initiate DB connection at module load (cached for serverless reuse)
connectDB().catch((err) => console.error("DB connection failed:", err.message));

// For local development only
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running in development mode on port ${PORT}`);
    });
}

export default app;
