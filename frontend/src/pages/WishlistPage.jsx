import React from 'react';
import { Link } from 'react-router-dom';
import {
    Heart,
    ShoppingBag,
    Trash2,
    ArrowRight,
    ShoppingBasket,
    ArrowLeft,
    Star
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const WishlistPage = () => {
    const { wishlistItems, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    const moveToCartHandler = (product) => {
        addToCart(product, 1);
        toggleWishlist(product);
        toast.success(`${product.name} moved to cart!`);
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-fade-in text-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-red-200" />
                </div>
                <h2 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight mb-2">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">Save your favorite items here to keep track of what you love. Explore our collection and start adding items to your wishlist!</p>
                <Link
                    to="/shop"
                    className="bg-[#3D3028] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#2c221c] transition-all shadow-lg shadow-[#3D3028]/20 flex items-center gap-2"
                >
                    Explore Products <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-[#3D3028] uppercase tracking-tighter mb-2 underline decoration-[#7A5C4A]/20 underline-offset-8">My Wishlist</h1>
                    <p className="text-gray-500 font-medium mt-4">You have saved {wishlistItems.length} items for later</p>
                </div>
                <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlistItems.map((product) => (
                    <div key={product._id} className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300">
                        {/* Product Image Section */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6 group-hover:shadow-2xl transition-all duration-500 rounded-3xl border border-gray-50">
                            {/* Remove Button */}
                            <button
                                onClick={() => {
                                    toggleWishlist(product);
                                    toast.error('Removed from wishlist');
                                }}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl bg-white shadow-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <Link to={`/product/${product._id || product.id}`} className="block w-full h-full">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </Link>

                            {/* Move to Cart Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button
                                    onClick={() => moveToCartHandler(product)}
                                    className="w-full bg-[#3D3028] text-white py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-black transition-all font-black uppercase tracking-widest text-[10px] shadow-xl"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                                </button>
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="px-2">
                            {product.rating && (
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-[10px] font-black text-[#3D3028]">{product.rating}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">({product.reviewsCount})</span>
                                </div>
                            )}
                            <Link to={`/product/${product._id || product.id}`} className="text-base font-black text-[#3D3028] hover:text-[#7A5C4A] transition-colors leading-tight mb-2 block line-clamp-1">
                                {product.name}
                            </Link>
                            <p className="text-lg font-black text-[#7A5C4A]">Rs. {product.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
