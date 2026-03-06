import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { shortDescription: { $regex: req.query.search, $options: 'i' } },
            ],
        }
        : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    const newArrivalFilter = req.query.isNewArrival === 'true' ? { isNewArrival: true } : {};
    const bestSellerFilter = req.query.isBestSeller === 'true' ? { isBestSeller: true } : {};

    // Price Filter
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
        priceFilter.price = {};
        if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    // Size & Color Filters
    const sizeFilter = req.query.sizes ? { sizes: { $in: req.query.sizes.split(',') } } : {};
    const colorFilter = req.query.colors ? { colors: { $in: req.query.colors.split(',') } } : {};

    const query = {
        ...keyword,
        ...categoryFilter,
        ...newArrivalFilter,
        ...bestSellerFilter,
        ...priceFilter,
        ...sizeFilter,
        ...colorFilter
    };

    const count = await Product.countDocuments(query);

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: Newest
    if (req.query.sort) {
        switch (req.query.sort) {
            case 'price_asc': sortOptions = { price: 1 }; break;
            case 'price_desc': sortOptions = { price: -1 }; break;
            case 'best_selling': sortOptions = { salesCount: -1 }; break;
            case 'highest_rated': sortOptions = { rating: -1 }; break;
            case 'newest': sortOptions = { createdAt: -1 }; break;
        }
    }

    const products = await Product.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort(sortOptions)
        .populate('category', 'name');

    res.json({
        data: products,
        page,
        pages: Math.ceil(count / pageSize),
        totalCount: count
    });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        shortDescription,
        category,
        stock,
        images,
        isNewArrival,
        isBestSeller,
        discountPrice,
        discountPercent,
        colors,
        sizes
    } = req.body;

    if (!name || !price || !category || stock === undefined) {
        res.status(400);
        throw new Error('Please provide all required fields (Name, Price, Category, Stock)');
    }

    if (category === "") {
        res.status(400);
        throw new Error('Invalid category ID');
    }

    const product = new Product({
        name,
        price,
        description,
        shortDescription,
        category,
        stock,
        images,
        isNewArrival,
        isBestSeller,
        discountPrice,
        discountPercent,
        colors,
        sizes
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        shortDescription,
        category,
        stock,
        images,
        isNewArrival,
        isBestSeller,
        discountPrice,
        discountPercent,
        colors,
        sizes
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (category === "") {
        res.status(400);
        throw new Error('Invalid category ID');
    }

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.shortDescription = shortDescription || product.shortDescription;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        product.images = images || product.images;
        product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;
        product.isBestSeller = isBestSeller !== undefined ? isBestSeller : product.isBestSeller;
        product.discountPrice = discountPrice || product.discountPrice;
        product.discountPercent = discountPercent || product.discountPercent;
        product.colors = colors || product.colors;
        product.sizes = sizes || product.sizes;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});
