import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Package,
    Truck,
    CreditCard,
    MapPin,
    CheckCircle2,
    Clock,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import NavBar from '../components/NavBar';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, config);
            setOrder(data);
        } catch (err) {
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#3D3028]" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-black text-[#3D3028] uppercase mb-4">Order Not Found</h2>
                <Link to="/shop" className="text-[#7A5C4A] font-bold underline">Go back to shopping</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfaf8] min-h-screen pb-20">
            <NavBar />
            <div className="max-w-5xl mx-auto px-4 pt-32 sm:px-6 lg:px-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Order Confirmed
                            </span>
                            <span className="text-gray-400 text-xs font-medium">Order ID: #{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#3D3028] uppercase tracking-tighter">Thank you for your order!</h1>
                    </div>
                    <Link to="/orders" className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] flex items-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> View All Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Tracker */}
                        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-[#A88B7A]" /> Order Tracking
                                </h3>
                                <div className="flex flex-col items-end">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-100' :
                                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                'bg-[#F4EBE6] text-[#3D3028] border border-[#EBDDD5]'
                                        }`}>
                                        {order.status}
                                    </span>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">Current Milestone</p>
                                </div>
                            </div>

                            <div className="relative px-4 pb-10">
                                {/* Track Line Background */}
                                <div className="absolute top-[22px] left-10 right-10 h-[3px] bg-gray-100 rounded-full" />

                                {/* Animated Progress Line */}
                                <div
                                    className="absolute top-[22px] left-10 h-[3px] bg-[#3D3028] rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(61,48,40,0.2)]"
                                    style={{
                                        width: `calc(${order.status === 'Pending' ? '0%' :
                                                order.status === 'Processing' ? '33.33%' :
                                                    order.status === 'Shipped' ? '66.66%' :
                                                        '100%'
                                            } - 5px)`
                                    }}
                                />

                                <div className="relative flex justify-between">
                                    {[
                                        { id: 'Pending', icon: Clock, label: 'Order Placed' },
                                        { id: 'Processing', icon: Package, label: 'Processing' },
                                        { id: 'Shipped', icon: Truck, label: 'On The Way' },
                                        { id: 'Delivered', icon: CheckCircle2, label: 'Delivered' }
                                    ].map((step, idx) => {
                                        const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                                        const currentStepIdx = steps.indexOf(order.status);
                                        const isCompleted = currentStepIdx >= idx;
                                        const isCurrent = currentStepIdx === idx;
                                        const Icon = step.icon;

                                        return (
                                            <div key={step.id} className="flex flex-col items-center gap-4 z-10">
                                                <div className={`
                                                    w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-700
                                                    ${isCompleted ? 'bg-[#3D3028] text-white shadow-lg scale-110' : 'bg-white text-gray-300 border-2 border-gray-50'}
                                                    ${isCurrent ? 'ring-4 ring-[#F4EBE6] animate-pulse' : ''}
                                                `}>
                                                    <Icon className={`w-5 h-5 ${isCompleted ? 'animate-in zoom-in duration-500' : ''}`} />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <p className={`text-[10px] font-black uppercase tracking-tight whitespace-nowrap ${isCompleted ? 'text-[#3D3028]' : 'text-gray-300'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCompleted && (
                                                        <p className="text-[8px] text-[#A88B7A] font-bold uppercase tracking-widest opacity-0 animate-in fade-in slide-in-from-top-1 duration-700 fill-mode-forwards">
                                                            {idx === 0 ? 'Verified' : idx === 3 ? 'Enjoy!' : 'Done'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 mb-8">
                                <Package className="w-5 h-5 text-[#7A5C4A]" /> Items Ordered
                            </h3>
                            <div className="divide-y divide-gray-50">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="py-6 flex gap-6 items-center group">
                                        <div className="w-20 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-[#3D3028] uppercase text-sm mb-1">{item.name}</h4>
                                            <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {item.size && <span>Size: {item.size}</span>}
                                                {item.color && <span>Color: {item.color}</span>}
                                                <span>Qty: {item.qty}</span>
                                            </div>
                                        </div>
                                        <p className="font-black text-[#3D3028]">Rs. {item.price * item.qty}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-8">
                        <div className="bg-[#3D3028] rounded-[40px] p-8 text-white shadow-2xl shadow-[#3D3028]/20">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Shipping Address</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <MapPin className="w-5 h-5 text-[#E3CBC1] flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-black uppercase tracking-widest mb-2">{order.shippingAddress.fullName}</p>
                                        <p className="text-[#E3CBC1]/70 leading-relaxed">
                                            {order.shippingAddress.street}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                            {order.shippingAddress.country}
                                        </p>
                                        <p className="mt-4 font-bold text-[#E3CBC1]">{order.shippingAddress.phone}</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex gap-4">
                                    <CreditCard className="w-5 h-5 text-[#E3CBC1] flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-black uppercase tracking-widest mb-1">Payment Method</p>
                                        <p className="text-[#E3CBC1]/70">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Total Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-[#3D3028]">Rs. {order.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-[#3D3028]">Rs. {order.shippingPrice}</span>
                                </div>
                                <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Paid</span>
                                    <span className="text-3xl font-black tracking-tighter text-[#3D3028]">Rs. {order.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
