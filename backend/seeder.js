import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Category from './models/category.js';
import Product from './models/product.js';
import User from './models/user.js';

dotenv.config();

const categories = [
    { name: 'Tees', description: 'Premium cotton t-shirts' },
    { name: 'Hoodies', description: 'Comfortable oversized hoodies' },
    { name: 'Bottoms', description: 'Streetwear cargo and pants' },
    { name: 'Accessories', description: 'Caps, bags and more' }
];

const products = [
    {
        name: 'Heavyweight Minimalist Tee',
        shortDescription: '100% Cotton, 240 GSM',
        price: 3500,
        discountPrice: 2800,
        discountPercent: 20,
        rating: 4.8,
        reviewsCount: 124,
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' }, { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80' }],
        isNewArrival: true,
        isBestSeller: true,
        stock: 50
    },
    {
        name: 'Vintage Graphic Oversized Boxy Tee',
        shortDescription: 'Acid washed finish',
        price: 4200,
        rating: 4.5,
        reviewsCount: 89,
        images: [{ url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80' }, { url: 'https://images.unsplash.com/photo-1583744654519-9430cdeef6e3?w=500&q=80' }],
        isNewArrival: true,
        isBestSeller: false,
        stock: 30
    },
    {
        name: 'Summer Essential Ribbed Tank',
        shortDescription: 'Breathable blend',
        price: 1800,
        discountPrice: 1500,
        discountPercent: 15,
        rating: 4.2,
        reviewsCount: 45,
        images: [{ url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80' }],
        isNewArrival: false,
        isBestSeller: false,
        stock: 100
    },
    {
        name: 'Premium Washed Hoodie',
        shortDescription: 'Fleece lined interior',
        price: 6500,
        rating: 5.0,
        reviewsCount: 312,
        images: [{ url: 'https://images.unsplash.com/photo-1556821840-dedbea415125?w=500&q=80' }, { url: 'https://images.unsplash.com/photo-1578587018452-892bace035e1?w=500&q=80' }],
        isNewArrival: false,
        isBestSeller: true,
        stock: 20
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Category.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('Cleared existing data');

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('usman123', salt);
        await User.create({
            name: 'Admin Usman',
            email: 'admin@usman.pk',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });
        console.log('Admin user seeded');

        // Insert categories
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories seeded');

        // Add category ID to products
        const teesId = createdCategories.find(c => c.name === 'Tees')._id;
        const hoodiesId = createdCategories.find(c => c.name === 'Hoodies')._id;

        const productsWithCategories = products.map(p => {
            if (p.name.includes('Tee') || p.name.includes('Tank')) {
                return { ...p, category: teesId };
            }
            if (p.name.includes('Hoodie')) {
                return { ...p, category: hoodiesId };
            }
            return { ...p, category: createdCategories[0]._id };
        });

        await Product.insertMany(productsWithCategories);
        console.log('Products seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
