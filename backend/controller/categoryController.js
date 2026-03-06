import asyncHandler from 'express-async-handler';
import Category from '../models/category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({
        name,
        description,
        image
    });

    if (category) {
        res.status(201).json(category);
    } else {
        res.status(400);
        throw new Error('Invalid category data');
    }
});
