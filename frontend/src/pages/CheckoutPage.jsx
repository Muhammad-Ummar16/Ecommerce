import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin, Phone, Truck, ShieldCheck, Loader2, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import NavBar from '../components/NavBar';

const CheckoutPage = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'Pakistan'
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const { cartItems, itemsPrice, shippingPrice, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login?redirect=/checkout');
        } else {
            fetchProfile();
        }
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, config);
            setProfile(data);
            if (data.addresses.length === 0) {
                setIsAddingAddress(true);
            }
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };

            const updatedProfile = {
                ...profile,
                addresses: [...profile.addresses, newAddress]
            };

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, updatedProfile, config);
            setProfile(data);
            setIsAddingAddress(false);
            setSelectedAddressIndex(data.addresses.length - 1);
            toast.success('Address added successfully!');
        } catch (err) {
            toast.error('Failed to add address');
        }
    };

    const placeOrderHandler = () => {
        if (!profile || !profile.addresses[selectedAddressIndex]) {
            toast.error('Please select a shipping address');
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmOrderHandler = async () => {
        try {
            setIsPlacingOrder(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
            };

            const orderData = {
                orderItems: cartItems,
                shippingAddress: profile.addresses[selectedAddressIndex],
                paymentMethod: 'Cash on Delivery',
                itemsPrice,
                shippingPrice,
                totalPrice,
            };

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData, config);
            toast.success('Order placed successfully!');
            clearCart();
            navigate(`/order/${data._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setIsPlacingOrder(false);
            setShowConfirmModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#3D3028]" />
            </div>
        );
    }

    return (
        <div className="bg-[#fcfaf8] min-h-screen pb-20">
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 pt-32 sm:px-6 lg:px-8">
                <CheckoutSteps step1 step2 step3={false} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Shipping Details */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight">Shipping Details</h2>
                                    <p className="text-gray-500 font-medium">Where should we send your order?</p>
                                </div>
                                {!isAddingAddress && profile.addresses.length > 0 && (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] flex items-center gap-2 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Add New Address
                                    </button>
                                )}
                            </div>

                            {isAddingAddress ? (
                                <form onSubmit={handleAddAddress} className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Full Name</label>
                                            <input
                                                type="text" required
                                                value={newAddress.fullName}
                                                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                placeholder="Recipient Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone Number</label>
                                            <input
                                                type="tel" required
                                                value={newAddress.phone}
                                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                placeholder="+92 300 1234567"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Street Address</label>
                                            <input
                                                type="text" required
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                placeholder="House#, Street, Area"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:col-span-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">City</label>
                                                <input
                                                    type="text" required
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Postal Code</label>
                                                <input
                                                    type="text" required
                                                    value={newAddress.postalCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2 col-span-2 md:col-span-1">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Country</label>
                                                <input
                                                    type="text" required
                                                    value={newAddress.country}
                                                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-[#3D3028] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-[#3D3028]/10"
                                        >
                                            Save & Use This Address
                                        </button>
                                        {profile.addresses.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingAddress(false)}
                                                className="px-8 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                    {profile.addresses.map((address, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedAddressIndex(index)}
                                            className={`relative p-6 rounded-[32px] border-2 cursor-pointer transition-all duration-300 ${selectedAddressIndex === index
                                                ? 'border-[#3D3028] bg-[#3D3028]/5 shadow-lg'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            {selectedAddressIndex === index && (
                                                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#3D3028] flex items-center justify-center">
                                                    <ShieldCheck className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`p-3 rounded-2xl ${selectedAddressIndex === index ? 'bg-[#3D3028] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#3D3028] uppercase tracking-tight">{address.fullName}</p>
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                                                        <Phone className="w-3 h-3" /> {address.phone}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed pl-12">
                                                {address.street}, {address.city}, {address.postalCode}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method Selector */}
                        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-[#3D3028] uppercase tracking-tight mb-8">Payment Method</h2>
                            <div className="p-6 rounded-3xl border-2 border-[#3D3028] bg-[#3D3028]/5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#3D3028] rounded-2xl flex items-center justify-center text-white">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-black text-[#3D3028] uppercase tracking-tight">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500 font-medium">Pay when you receive your package</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-6 h-6 rounded-full bg-[#3D3028] flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32">
                        <div className="bg-[#3D3028] rounded-[48px] p-8 lg:p-10 text-white shadow-2xl shadow-[#3D3028]/30">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Order Summary</h3>

                            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{item.name}</p>
                                            <p className="text-[10px] text-[#E3CBC1]/60">Qty: {item.qty} × Rs. {item.price}</p>
                                        </div>
                                        <p className="text-xs font-black">Rs. {item.qty * item.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-white/10 mb-10">
                                <div className="flex justify-between items-center text-sm font-medium text-[#E3CBC1]/70">
                                    <span>Subtotal</span>
                                    <span>Rs. {itemsPrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-[#E3CBC1]/70">
                                    <span>Shipping</span>
                                    <span>{shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-base font-black uppercase tracking-widest text-[#E3CBC1]">Total</span>
                                    <span className="text-3xl font-black tracking-tighter">Rs. {totalPrice}</span>
                                </div>
                            </div>

                            <button
                                onClick={placeOrderHandler}
                                disabled={isAddingAddress}
                                className="w-full bg-white text-[#3D3028] py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#E3CBC1] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                Place Order <ArrowRight className="w-4 h-4" />
                            </button>

                            <p className="text-center text-[9px] font-bold text-[#E3CBC1]/30 uppercase tracking-[0.2em] mt-8 leading-relaxed">
                                By placing your order, you agree to our <br />
                                terms of service and refund policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => !isPlacingOrder && setShowConfirmModal(false)}
                    />
                    <div className="relative bg-white w-full max-w-md rounded-[40px] p-8 md:p-10 shadow-2xl animate-zoom-in">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-[#F4EBE6] rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="w-10 h-10 text-[#3D3028]" />
                            </div>
                            <h3 className="text-2xl font-black text-[#3D3028] uppercase tracking-tight">Confirm Your Order</h3>
                            <p className="text-gray-500 font-medium">Please review your details before placing the order.</p>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Shipping To</span>
                                <span className="text-[#3D3028] font-black uppercase text-[10px] text-right max-w-[150px] truncate">
                                    {profile.addresses[selectedAddressIndex].fullName}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Payment</span>
                                <span className="text-[#3D3028] font-black uppercase text-[10px]">Cash on Delivery</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                                <span className="text-2xl font-black text-[#3D3028]">Rs. {totalPrice}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmOrderHandler}
                                disabled={isPlacingOrder}
                                className="w-full bg-[#3D3028] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-[#3D3028]/20 flex items-center justify-center gap-3"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                                    </>
                                ) : (
                                    <>Confirm & Place Order</>
                                )}
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isPlacingOrder}
                                className="w-full bg-gray-100 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
