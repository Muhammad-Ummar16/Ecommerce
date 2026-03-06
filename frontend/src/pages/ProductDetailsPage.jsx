import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronRight, Truck, RefreshCcw, ShieldCheck, Minus, Plus, X, ZoomIn } from 'lucide-react';
import NavBar from '../components/NavBar';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { data: product, isLoading, isError } = useProduct(id);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { settings } = useSettings();

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (product) {
            if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
            if (product.colors?.length > 0) setSelectedColor(product.colors[0]);
            setMainImage(product.images?.[0]?.url || product.image);
        }
    }, [product]);

    // Handle Image Gallery
    const imageGallery = product?.images?.length > 0
        ? product.images.map(img => img.url)
        : [product?.image].filter(Boolean);

    if (isLoading) {
        return (
            <div className="bg-[#fcfaf8] min-h-screen">
                <NavBar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D3028]"></div>
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="bg-[#fcfaf8] min-h-screen">
                <NavBar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col justify-center items-center h-[60vh]">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <Link to="/shop" className="text-[#7A5C4A] hover:underline">Back to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfaf8] min-h-screen pb-20">
            <NavBar />

            {/* Breadcrumbs */}
            <div className="pt-28 pb-8 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Link to="/" className="hover:text-[#3D3028] transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to="/shop" className="hover:text-[#3D3028] transition-colors">Shop</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 truncate">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-8 lg:mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 mb-20 relative">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

                    {/* Left Column: Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex xl:flex-col gap-4 overflow-x-auto md:w-24 xl:w-28 shrink-0 hide-scrollbar">
                            {imageGallery.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-20 xl:w-full aspect-[4/5] overflow-hidden bg-gray-100 border-2 transition-all shrink-0 ${mainImage === img ? 'border-[#3D3028]' : 'border-transparent hover:border-gray-300'}`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div
                            className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden cursor-zoom-in group rounded-xl"
                            onClick={() => setIsModalOpen(true)}
                        >
                            {product.isNewArrival && (
                                <span className="absolute top-4 left-4 z-10 bg-white text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider shadow-sm">
                                    New
                                </span>
                            )}
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover animate-fade-in group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="w-12 h-12 text-white drop-shadow-md" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="w-full lg:w-1/2 flex flex-col">

                        <div className="mb-8">
                            <h1 className="text-3xl sm:text-4xl font-black text-[#3D3028] leading-tight mb-2">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2">({product.reviewsCount} Reviews)</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                {product.stock > 0 ? (
                                    <span className="text-sm text-[#00a650] font-bold">In Stock ({product.stock})</span>
                                ) : (
                                    <span className="text-sm text-red-500 font-bold">Out of Stock</span>
                                )}
                            </div>

                            <div className="flex items-baseline gap-3">
                                {product.discountPrice ? (
                                    <>
                                        <span className="text-2xl font-black text-red-500">Rs. {product.discountPrice.toLocaleString()}</span>
                                        <span className="text-lg text-gray-400 line-through font-medium">Rs. {product.price.toLocaleString()}</span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-black text-[#3D3028]">Rs. {product.price.toLocaleString()}</span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.shortDescription}. Crafted with premium materials for maximum comfort and durability. This piece represents the intersection of streetwear culture and high-end fashion, designed to be a timeless addition to your wardrobe.
                        </p>

                        <div className="border-t border-b border-gray-100 py-6 mb-8 flex flex-col gap-6">

                            {/* Color Selection */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-sm text-[#3D3028] uppercase">Color</span>
                                        <span className="text-xs text-gray-500 font-medium">{product.colors.length} Available</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-[#3D3028]' : 'hover:scale-110'}`}
                                            >
                                                <span className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: color }}></span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-sm text-[#3D3028] uppercase">Size</span>
                                        <button className="text-xs text-gray-500 underline font-medium hover:text-[#3D3028]">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[48px] h-12 flex items-center justify-center border font-bold text-sm transition-all px-4 ${selectedSize === size ? 'border-[#3D3028] bg-[#3D3028] text-white' : 'border-gray-200 text-gray-800 hover:border-gray-800'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            {/* Quantity */}
                            <div className={`flex items-center justify-between border border-gray-200 px-4 h-14 sm:w-1/3 w-full ${product.stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-black">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold">{quantity}</span>
                                <button
                                    onClick={() => {
                                        if (quantity < product.stock) {
                                            setQuantity(quantity + 1);
                                        } else {
                                            toast.error(`Only ${product.stock} items in stock`);
                                        }
                                    }}
                                    className="text-gray-500 hover:text-black"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (product.stock > 0) {
                                        addToCart(product, quantity, selectedColor, selectedSize);
                                        toast.success(`${product.name} added to cart!`);
                                    }
                                }}
                                disabled={product.stock === 0}
                                className={`flex-1 h-14 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors relative overflow-hidden group ${product.stock > 0
                                    ? 'bg-[#3D3028] text-white hover:bg-[#2c221d]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </span>
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={() => {
                                    toggleWishlist(product);
                                    toast.success(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
                                }}
                                className={`h-14 w-14 border flex items-center justify-center transition-colors shrink-0 ${isInWishlist(product._id)
                                    ? 'bg-red-50 border-red-200 text-red-500'
                                    : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-500'
                                    }`}
                            >
                                <Heart className={`w-6 h-6 ${isInWishlist(product._id) ? 'fill-red-500' : ''}`} />
                            </button>

                            {/* WhatsApp Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    const productId = product._id || product.id;
                                    const siteUrl = settings.siteUrl || window.location.origin;
                                    const productUrl = `${siteUrl}/product/${productId}`;
                                    const message = `*Inquiry from ${settings.siteName || 'your store'}*\n\nHello, I am interested in this product:\n\n*Product:* ${product.name}\n*Price:* Rs. ${(product.discountPrice || product.price).toLocaleString()}\n${selectedSize ? `*Size:* ${selectedSize}\n` : ''}${selectedColor ? `*Color:* ${selectedColor}\n` : ''}*Link:* ${productUrl}\n\nPlease let me know about its availability. Thank you!`;
                                    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
                                    window.open(whatsappUrl, '_blank');
                                }}
                                className="h-14 w-14 border border-green-100 bg-green-50 text-green-500 flex items-center justify-center transition-all hover:bg-green-100 hover:scale-110 shrink-0"
                                title="Inquire on WhatsApp"
                            >
                                <WhatsAppIcon />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white p-6 border border-gray-100 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-[#7A5C4A]" />
                                <span className="text-sm font-medium text-gray-700">Free delivery over Rs. 5000</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <RefreshCcw className="w-5 h-5 text-[#7A5C4A]" />
                                <span className="text-sm font-medium text-gray-700">14-day hassle-free returns</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Image Modal Lightbox */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="fixed top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-[110]"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain animate-fade-in select-none rounded-md"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductDetailsPage;
