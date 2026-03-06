import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    ShoppingBag,
    Mail,
    Phone,
    Copy,
    ExternalLink,
    Loader2
} from 'lucide-react';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState('');

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`, config);
            setOrder(data);
            setStatus(data.status);
        } catch (err) {
            toast.error('Failed to load order details');
            navigate('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            setUpdating(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { status }, config);
            toast.success('Order status updated');
            fetchOrderDetails();
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#3D3028]" />
            <p className="font-bold text-[#3D3028] uppercase tracking-widest text-xs">Fetching Details...</p>
        </div>
    );

    const statusConfig = {
        'Pending': { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' },
        'Processing': { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        'Shipped': { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        'Delivered': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
        'Cancelled': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' }
    };

    const currentStatus = statusConfig[order.status] || statusConfig['Pending'];
    const StatusIcon = currentStatus.icon;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#3D3028] transition-all hover:shadow-md"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5 ${currentStatus.bg} ${currentStatus.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:bg-gray-50 transition-all">
                        <ExternalLink className="w-4 h-4" /> Download Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns - Order Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items List */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-[#A88B7A]" />
                                <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Order Items</h2>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.orderItems.length} Products</span>
                        </div>
                        <div className="p-8 space-y-6">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-6 group">
                                    <div className="w-20 h-24 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[#3D3028] text-lg line-clamp-1">{item.name}</p>
                                        <p className="text-sm text-gray-400 font-medium mt-1">Ref: {item.product.slice(-5).toUpperCase()}</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-xs font-black uppercase text-[#7A5C4A] px-2.5 py-1 bg-[#F4EBE6] rounded-lg">Qty: {item.qty}</span>
                                            <span className="text-sm font-bold text-[#3D3028]">RS {item.price} each</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-[#3D3028]">RS {item.price * item.qty}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-[#FDFBF9] border-t border-gray-50">
                            <div className="space-y-4 max-w-xs ml-auto">
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-[#3D3028] font-bold">RS {order.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-[#3D3028] font-bold">RS {order.shippingPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-400 uppercase tracking-widest text-[10px] pt-4 border-t border-gray-200">
                                    <span className="font-black">Total Paid</span>
                                    <span className="text-2xl font-black text-[#3D3028]">RS {order.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-[#A88B7A]" />
                                <h3 className="font-black text-[#3D3028] uppercase tracking-tight">Delivery Address</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-[#3D3028]">{order.shippingAddress.street}</p>
                                <p className="text-sm text-gray-600 font-medium">
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-sm text-gray-600 font-medium uppercase tracking-widest text-[10px]">{order.shippingAddress.country}</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(`${order.shippingAddress.street}, ${order.shippingAddress.city}`)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] transition-colors"
                            >
                                <Copy className="w-3.5 h-3.5" /> Copy Address
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-[#A88B7A]" />
                                <h3 className="font-black text-[#3D3028] uppercase tracking-tight">Payment Info</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Method</p>
                                    <p className="text-sm font-bold text-[#3D3028]">{order.paymentMethod}</p>
                                </div>
                                <div className={`p-3 rounded-xl border flex items-center gap-3 ${order.isPaid ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                    {order.isPaid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    <span className="text-xs font-black uppercase tracking-widest">{order.isPaid ? `Paid at ${new Date(order.paidAt).toLocaleDateString()}` : 'Unpaid (COD)'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Management */}
                <div className="space-y-8">
                    {/* Customer Profile */}
                    <div className="bg-[#3D3028] p-8 rounded-[32px] text-white space-y-6 shadow-xl shadow-[#3D3028]/20">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-5 h-5 text-[#E3CBC1]" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Customer Profile</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black">
                                {order.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-lg font-bold">{order.user?.name || 'Guest User'}</p>
                                <p className="text-xs text-[#E3CBC1]/70 font-medium">Customer Since 2024</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => copyToClipboard(order.user?.email)}>
                                <Mail className="w-4 h-4 text-[#E3CBC1]/60" />
                                <span className="text-sm font-medium hover:text-[#E3CBC1] transition-colors">{order.user?.email || 'No email provided'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[#E3CBC1]/60" />
                                <span className="text-sm font-medium">{order.phone || '+92 312 0000000'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Management */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-[#A88B7A] rounded-full"></div>
                            <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Management</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] ml-1">Current Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all font-bold text-[#3D3028] cursor-pointer appearance-none"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <button
                                onClick={handleStatusUpdate}
                                disabled={updating || status === order.status}
                                className="w-full py-4 bg-[#3D3028] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#2c221c] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#3D3028]/10"
                            >
                                {updating ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-50">
                                <Clock className="w-4 h-4 text-blue-500 mt-1" />
                                <p className="text-[10px] text-blue-600/80 leading-relaxed font-bold uppercase tracking-wide">
                                    Updating the status to "Delivered" will automatically mark the order as paid.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
