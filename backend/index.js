import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// For local development only
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running in development mode on port ${PORT}`);
    });
}


export default app;

