import connectDB from "../db/connect.js";
import Product from "../models/Product.js";

export default async function handler(req, res) {
    try {
        await connectDB();   // important

        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}