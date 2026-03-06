import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Package,
    ChevronRight,
    Search,
    Calendar,
    CreditCard,
    Clock,
    CheckCircle2,
    AlertCircle,
    ShoppingBag,
    Loader2
} from 'lucide-react';
import NavBar from '../components/NavBar';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/myorders`, config);
            setOrders(data);
        } catch (err) {
            toast.error('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Processing': return 'bg-purple-50 text-purple-600 border-purple-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
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
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-[#3D3028] uppercase tracking-tighter mb-2">Order History</h1>
                        <p className="text-gray-500 font-medium">Tracking and managing your past purchases</p>
                    </div>
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3D3028] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by Order ID..."
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all shadow-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-sm animate-fade-in">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-200" />
                        </div>
                        <h2 className="text-2xl font-black text-[#3D3028] uppercase mb-2">No Orders Found</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't placed any orders yet or search term didn't match.</p>
                        <Link to="/shop" className="bg-[#3D3028] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">
                            Start Shopping Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[32px] border border-gray-100 hover:border-[#3D3028]/20 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                                <div className="p-8">
                                    <div className="flex flex-wrap justify-between items-center gap-6 mb-8 pb-8 border-b border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#3D3028]">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Order ID</p>
                                                <p className="font-black text-[#3D3028]">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Date</p>
                                                <div className="flex items-center gap-2 text-sm font-bold text-[#3D3028]">
                                                    <Calendar className="w-4 h-4 text-gray-300" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Status</p>
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Total Amount</p>
                                                <p className="text-lg font-black text-[#7A5C4A]">Rs. {order.totalPrice}</p>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/order/${order._id}`}
                                            className="px-6 py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#3D3028] rounded-xl hover:bg-[#3D3028] hover:text-white transition-all flex items-center gap-2"
                                        >
                                            Track Order <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
                                        <div className="flex items-center gap-4">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex-shrink-0 relative group/item">
                                                    <div className="w-20 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                                        <span className="text-white font-black text-xs">x{item.qty}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.orderItems.length > 5 && (
                                                <div className="w-20 h-24 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 font-black text-sm">
                                                    +{order.orderItems.length - 5}
                                                </div>
                                            )}
                                        </div>

                                        {/* Status on Card */}
                                        <div className={`hidden sm:flex items-center gap-2 px-6 py-3 rounded-2xl border ${getStatusStyle(order.status)}`}>
                                            {order.status === 'Delivered' ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : (
                                                <Clock className="w-4 h-4 animate-pulse" />
                                            )}
                                            <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
