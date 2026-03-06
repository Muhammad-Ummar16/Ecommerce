import React, { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { settings } = useSettings();

    const isWishlisted = isInWishlist(product._id);

    // Backend uses _id and images array
    const productId = product._id || product.id;
    const mainImage = product.images?.[0]?.url || product.image;
    const hoverImage = product.images?.[1]?.url || product.hoverImage;

    return (
        <div className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300">
            {/* Product Image Section */}
            <Link to={`/product/${productId}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100 mb-4">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.isNewArrival && (
                        <span className="bg-white text-black text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-sm">
                            New
                        </span>
                    )}
                    {product.discountPercent > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider shadow-sm">
                            -{product.discountPercent}%
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                        toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all font-bold"
                >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {/* WhatsApp Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        const siteUrl = settings.siteUrl || window.location.origin;
                        const productUrl = `${siteUrl}/product/${productId}`;
                        const message = `*Inquiry from ${settings.siteName || 'your store'}*\n\nHello, I am interested in this product:\n\n*Product:* ${product.name}\n*Price:* Rs. ${(product.discountPrice || product.price).toLocaleString()}\n*Link:* ${productUrl}\n\nPlease let me know about its availability. Thank you!`;
                        const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                    }}
                    className="absolute top-13 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 hover:text-green-600 hover:scale-110 transition-all"
                >
                    <WhatsAppIcon />
                </button>

                {/* Images with hover effect */}
                <div
                    className="w-full h-full"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <img
                        src={mainImage}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && hoverImage ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {hoverImage && (
                        <img
                            src={hoverImage}
                            alt={`${product.name} alternate view`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </div>

                {/* Quick Add overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 1);
                            toast.success(`${product.name} added to cart!`);
                        }}
                        className="w-full bg-black/90 backdrop-blur-sm text-white py-3 flex justify-center items-center gap-2 hover:bg-black transition-colors font-medium text-sm"
                    >
                        <ShoppingBag className="w-4 h-4" /> Quick Add
                    </button>
                </div>
            </Link>

            {/* Product Info Section */}
            <div className="flex flex-col flex-1 px-1">
                {/* Ratings */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                            />
                        ))}
                        <span className="text-[10px] text-gray-500 ml-1">({product.reviewsCount || 0})</span>
                    </div>
                )}

                <Link to={`/product/${productId}`} className="text-sm font-semibold text-gray-900 group-hover:text-[#7A5C4A] transition-colors leading-snug mb-1 line-clamp-1">
                    {product.name}
                </Link>

                {product.shortDescription && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.shortDescription}</p>
                )}

                <div className="mt-auto flex items-center gap-2">
                    {product.discountPrice ? (
                        <>
                            <span className="text-sm font-bold text-red-500">Rs. {product.discountPrice.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 line-through">Rs. {product.price.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
