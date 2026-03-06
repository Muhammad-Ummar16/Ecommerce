import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    Truck,
    ShieldCheck,
    ArrowLeft,
    Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQty, itemsPrice, shippingPrice, totalPrice } = useCart();
    const navigate = useNavigate();

    const checkoutHandler = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-fade-in">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Explore our latest collection and find something you love.</p>
                <Link
                    to="/shop"
                    className="bg-[#3D3028] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#2c221c] transition-all shadow-lg shadow-[#3D3028]/20 flex items-center gap-2"
                >
                    Start Shopping <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-black text-[#3D3028] uppercase tracking-tighter mb-2">Shopping Bag</h1>
                    <p className="text-gray-500 font-medium">You have {cartItems.length} items in your bag</p>
                </div>
                <Link to="/shop" className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <div className="col-span-6">Product Details</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>

                    {cartItems.map((item) => (
                        <div key={`${item._id}-${item.color}-${item.size}`} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                                {/* Product Info */}
                                <div className="md:col-span-6 flex items-center gap-6">
                                    <div className="w-24 h-32 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item._id}`} className="text-lg font-black text-[#3D3028] hover:text-[#7A5C4A] transition-colors block leading-tight mb-2">
                                            {item.name}
                                        </Link>
                                        <div className="flex flex-wrap gap-2">
                                            {item.color && (
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md text-gray-500">Color: {item.color}</span>
                                            )}
                                            {item.size && (
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md text-gray-500">Size: {item.size}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="md:col-span-2 flex justify-center">
                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                        <button
                                            onClick={() => updateQty(item._id, item.color, item.size, Math.max(1, item.qty - 1))}
                                            className="p-2 hover:bg-white hover:text-[#3D3028] text-gray-400 rounded-lg transition-all"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-black text-[#3D3028]">{item.qty}</span>
                                        <button
                                            onClick={() => {
                                                if (item.qty < item.countInStock) {
                                                    updateQty(item._id, item.color, item.size, item.qty + 1);
                                                } else {
                                                    toast.error(`Only ${item.countInStock} items available`);
                                                }
                                            }}
                                            className={`p-2 rounded-lg transition-all ${item.qty >= item.countInStock ? 'text-gray-200 cursor-not-allowed' : 'hover:bg-white hover:text-[#3D3028] text-gray-400'}`}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-400 mt-2 absolute -bottom-6">
                                        {item.countInStock} available
                                    </p>
                                </div>

                                {/* Single Price */}
                                <div className="md:col-span-2 text-center">
                                    <span className="text-sm font-bold text-[#3D3028]">Rs. {item.price}</span>
                                </div>

                                {/* Total Price & Action */}
                                <div className="md:col-span-2 text-right flex flex-col items-end gap-2">
                                    <p className="text-lg font-black text-[#3D3028]">Rs. {item.price * item.qty}</p>
                                    <button
                                        onClick={() => {
                                            removeFromCart(item._id, item.color, item.size);
                                            toast.error(`${item.name} removed from cart`);
                                        }}
                                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-[#3D3028] rounded-[40px] p-8 lg:p-10 text-white shadow-2xl shadow-[#3D3028]/30 sticky top-32">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Summary</h2>

                        <div className="space-y-6">
                            {/* Promo Code */}
                            <div className="relative group">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E3CBC1]/50 group-focus-within:text-[#E3CBC1]" />
                                <input
                                    type="text"
                                    placeholder="Promo Code"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-[#E3CBC1]/50 transition-all placeholder:text-[#E3CBC1]/30"
                                />
                            </div>

                            <div className="space-y-3 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#E3CBC1]/70 font-medium">Subtotal</span>
                                    <span className="text-base font-bold text-white">Rs. {itemsPrice}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-[#E3CBC1]/70 font-medium">Shipping</span>
                                    <span className="text-base font-bold text-white">
                                        {shippingPrice === 0 ? (
                                            <span className="text-green-400">FREE</span>
                                        ) : (
                                            `Rs. ${shippingPrice}`
                                        )}
                                    </span>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E3CBC1]/50 mb-1">Estimated Total</p>
                                        <p className="text-4xl font-black tracking-tighter text-white">Rs. {totalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-white text-[#3D3028] py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#E3CBC1] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 mt-4"
                            >
                                Checkout Now <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="pt-8 space-y-4">
                                <div className="flex items-center gap-4 text-[#E3CBC1]/50">
                                    <Truck className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">Free Delivery on orders above Rs. 5000</p>
                                </div>
                                <div className="flex items-center gap-4 text-[#E3CBC1]/50">
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-[10px] font-bold leading-tight uppercase tracking-wider">Secure Payment & Buyer Protection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
