import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingBag, LayoutGrid, Filter } from 'lucide-react';
import NavBar from '../components/NavBar';

const CollectionsPage = () => {
    // Fetch all categories
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
            return data.categories || data || [];
        }
    });

    // Fetch products (limit to 100 for grouping)
    const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 100 });
    const products = productsData?.data || [];

    // Group products by category
    const groupedCollections = useMemo(() => {
        if (!categories || !products.length) return [];

        return categories.map(category => {
            const categoryProducts = products.filter(p => p.category?._id === category._id || p.category === category._id);
            return {
                ...category,
                products: categoryProducts.slice(0, 4) // Show top 4 per category
            };
        }).filter(c => c.products.length > 0); // Only show categories with products
    }, [categories, products]);

    if (categoriesLoading || productsLoading) {
        return (
            <div className="min-h-screen bg-[#f8f5f2]">
                <NavBar />
                <div className="pt-32 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D3028]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f5f2] font-sans pb-20">
            <NavBar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl animate-fade-in">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7A5C4A] mb-4 block">Curated Selection</span>
                            <h1 className="text-5xl md:text-7xl font-black text-[#3D3028] uppercase tracking-tighter leading-[0.9] mb-6">
                                Seasonal <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D3028] to-[#7A5C4A]">Collections</span>
                            </h1>
                            <p className="text-gray-500 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                                Explore our masterfully crafted distributions. From essential everyday staples to statement premium pieces, find your perfect fit.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 animate-fade-in delay-100">
                            <div className="px-6 py-4 bg-[#3D3028] text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-[#3D3028]/10">
                                <LayoutGrid className="w-5 h-5 text-[#E3CBC1]" />
                                <span className="text-xs font-black uppercase tracking-widest">{groupedCollections.length} Categories</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Abstract background elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#E3CBC1]/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
                {groupedCollections.map((collection, index) => (
                    <section key={collection._id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-end justify-between mb-10 border-b border-[#3D3028]/5 pb-8">
                            <div>
                                <h2 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight mb-2 flex items-center gap-3">
                                    {collection.name}
                                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{collection.products.length} Products</span>
                                </h2>
                                <p className="text-sm text-gray-500 font-medium max-w-md">
                                    {collection.description || `Discover our latest ${collection.name} arrivals, designed for the modern lifestyle.`}
                                </p>
                            </div>
                            <Link
                                to={`/shop?category=${collection._id}`}
                                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] transition-colors"
                            >
                                View Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            {collection.products.map((product) => (
                                <Link
                                    to={`/product/${product._id}`}
                                    key={product._id}
                                    className="group block"
                                >
                                    <div className="relative aspect-[3/4] bg-white rounded-[24px] overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500 border border-gray-100">
                                        <img
                                            src={product.images[0]?.url}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <div className="w-full bg-white/90 backdrop-blur-md rounded-xl p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex justify-between items-center shadow-lg">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter text-[#3D3028]/40 leading-none mb-1">Price</span>
                                                    <span className="text-sm font-black text-[#3D3028]">Rs. {product.price}</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-[#3D3028] flex items-center justify-center text-white">
                                                    <ShoppingBag className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {product.isNewArrival && (
                                                <span className="bg-white/90 backdrop-blur-sm text-[#3D3028] text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">New</span>
                                            )}
                                            {product.discountPrice && (
                                                <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">Sale</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 px-2">
                                        <h3 className="text-sm font-black text-[#3D3028] uppercase tracking-tight truncate group-hover:text-[#7A5C4A] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                            {product.shortDescription || 'MZ Premium Wear'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}

                {groupedCollections.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Filter className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-[#3D3028] uppercase">No collections found</h3>
                        <p className="text-gray-500 text-sm mt-2 max-w-xs">We are currently updating our distributions. Please check back later.</p>
                        <Link to="/shop" className="mt-8 px-8 py-3 bg-[#3D3028] text-white rounded-full text-xs font-black uppercase tracking-widest">Explore Shop</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectionsPage;
