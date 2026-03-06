import React, { useState, useEffect } from 'react';
import { ArrowRight, Truck, RefreshCcw, ShieldCheck, Gem, Star, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import ProductCard from '../components/ProductCard';

// Testimonials mock (can be dynamic later)
const testimonials = [
    {
        id: 1,
        name: 'Alex Johnson',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
        review: 'The quality is genuinely unmatched. Best oversized tee I have ever purchased. Drops perfectly.',
        rating: 5
    },
    {
        id: 2,
        name: 'Sarah Williams',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        review: 'Fastest shipping I have experienced, and the packaging was super premium. Highly recommend MZ Wear!',
        rating: 5
    },
    {
        id: 3,
        name: 'David Chen',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        review: 'The minimal collection is exactly what my wardrobe needed. Great fit, doesn\'t shrink after washing.',
        rating: 4
    }
];

const HomePage = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                setLoading(true);
                // Fetch best sellers (limit 8)
                const bestSellersRes = await axios.get(`${import.meta.env.VITE_API_URL}/products?isBestSeller=true&limit=8`);
                setBestSellers(bestSellersRes.data.data || bestSellersRes.data);

                // Fetch new arrivals (limit 4)
                const newArrivalsRes = await axios.get(`${import.meta.env.VITE_API_URL}/products?isNewArrival=true&limit=4`);
                setNewArrivals(newArrivalsRes.data.data || newArrivalsRes.data);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomePageData();
    }, []);
    return (
        <div className="bg-white min-h-screen pb-20">
            <NavBar />

            {/* 1. Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center md:justify-start pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="Hero1.jpg"
                        alt="Hero Background"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/40 "></div>
                </div>

                <div className="relative z-10 text-center md:text-left px-6 md:px-12 lg:px-24 max-w-4xl animate-fade-in-up">
                    <p className="text-[#E3CBC1] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm md:text-base mb-4 md:mb-6">New Collection 2026</p>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-4 md:mb-6 leading-tight">
                        Wear Your <br className="hidden md:block" /> Identity
                    </h1>
                    <p className="text-gray-200 text-base md:text-xl font-medium max-w-2xl mb-8 md:mb-10 mx-auto md:mx-0">
                        Premium streetwear crafted for comfort and style. Redefine your everyday look with our exclusive, high-quality pieces.
                    </p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4">
                        <Link to="/shop" className="w-full sm:w-auto bg-white text-black px-10 py-4 font-bold rounded-full hover:bg-gray-100 transition-all flex items-center justify-center gap-2 hover:scale-105">
                            Shop Now <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/collections" className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-10 py-4 font-bold rounded-full hover:bg-white/10 transition-all text-center flex justify-center items-center">
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </section>


            {/* 5. Why Choose Us (Trust Builder - Placed here to break up product grids) */}
            <section className="bg-[#f8f5f2] py-16 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#3D3028] rounded-full flex items-center justify-center text-[#E3CBC1] mb-3 md:mb-4">
                                <Truck className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h4 className="text-sm md:text-base font-bold text-[#3D3028] mb-1">Fast Shipping</h4>
                            <p className="text-[10px] md:text-xs text-gray-500">Free delivery over Rs. 5000</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#3D3028] rounded-full flex items-center justify-center text-[#E3CBC1] mb-3 md:mb-4">
                                <RefreshCcw className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h4 className="text-sm md:text-base font-bold text-[#3D3028] mb-1">Easy Returns</h4>
                            <p className="text-[10px] md:text-xs text-gray-500">14-day hassle-free returns</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#3D3028] rounded-full flex items-center justify-center text-[#E3CBC1] mb-3 md:mb-4">
                                <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h4 className="text-sm md:text-base font-bold text-[#3D3028] mb-1">Secure Payment</h4>
                            <p className="text-[10px] md:text-xs text-gray-500">100% safe & encrypted</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#3D3028] rounded-full flex items-center justify-center text-[#E3CBC1] mb-3 md:mb-4">
                                <Gem className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <h4 className="text-sm md:text-base font-bold text-[#3D3028] mb-1">Premium Fabric</h4>
                            <p className="text-[10px] md:text-xs text-gray-500">High quality materials</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Best Selling / Featured Products */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-gray-100">
                <div className="flex justify-between items-end mb-10">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                        <h2 className="text-2xl md:text-4xl font-black text-[#3D3028] uppercase tracking-tight mb-2">Best Sellers 🚀</h2>
                        <p className="text-sm md:text-base text-gray-500">Our most popular pieces right now</p>
                    </div>
                    <Link to="/shop" className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#7A5C4A] hover:text-[#3D3028] transition-colors pb-1 border-b-2 border-transparent hover:border-[#3D3028]">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 min-h-[400px]">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-[#7A5C4A] mb-4" />
                            <p className="text-gray-500 animate-pulse">Loading amazing collection...</p>
                        </div>
                    ) : bestSellers.length > 0 ? (
                        bestSellers.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No best sellers found.
                        </div>
                    )}
                </div>

                <div className="mt-10 text-center sm:hidden">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-[#3D3028] bg-gray-100 px-6 py-3 rounded-full">
                        View All Best Sellers
                    </Link>
                </div>
            </section>

            {/* 4. New Arrivals */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                        <h2 className="text-2xl md:text-4xl font-black text-[#3D3028] uppercase tracking-tight mb-2">New Arrivals</h2>
                        <p className="text-sm md:text-base text-gray-500">Fresh styles just dropped</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 min-h-[200px]">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-[#7A5C4A]" />
                        </div>
                    ) : newArrivals.length > 0 ? (
                        newArrivals.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            Coming Soon!
                        </div>
                    )}
                </div>
            </section>

            {/* 8. Discount Banner Section */}
            <section className="my-10 mx-4 sm:mx-6 lg:mx-8 max-w-7xl xl:mx-auto rounded-3xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-black z-0">
                    <img
                        src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80"
                        alt="Discount Banner"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 backdrop-blur-[4px]"></div>
                </div>
                <div className="relative z-10 p-8 md:p-20 text-center md:text-left">
                    <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest mb-4 md:mb-6 inline-block rounded-full">Limited Time Offer</span>
                    <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight mb-3 md:mb-4">Get 15% Off <br className="hidden md:block" /> On First Order</h2>
                    <p className="text-gray-200 text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto md:mx-0">Sign up for our newsletter and get an instant discount code for your first purchase.</p>
                    <Link to="/signup" className="inline-block bg-white text-black px-10 py-4 font-bold rounded-full hover:bg-gray-100 transition-colors">
                        Claim Offer Now
                    </Link>
                </div>
            </section>





        </div>
    );
};

export default HomePage;
