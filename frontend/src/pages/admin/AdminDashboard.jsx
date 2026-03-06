import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Banknote,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Package,
    XCircle,
    Loader2
} from 'lucide-react';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        users: 0,
        orders: 0,
        revenue: '0.00',
        cancelled: 0,
        processing: 0,
        pending: 0,
        delivered: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) {
                    toast.error('Authentication required');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, config);
                setStats(data.stats);
                setRecentOrders(data.recentOrders);
            } catch (err) {
                toast.error('Failed to fetch dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Revenue', value: `RS ${stats.revenue}`, change: '+0%', positive: true, icon: Banknote, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Orders', value: stats.orders, change: '+0%', positive: true, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Products', value: stats.products, change: '+0%', positive: true, icon: Package, color: 'text-[#3D3028]', bg: 'bg-[#F4EBE6]' },
        { label: 'Cancelled', value: stats.cancelled, change: '0%', positive: false, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#3D3028]" />
            <p className="font-bold text-[#3D3028] uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#3D3028] uppercase tracking-tight">Overview</h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time performance summary for your store.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#7A5C4A]" />
                    <span className="text-sm font-bold text-[#3D3028]">Live Updates</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-0.5 text-xs font-black ${stat.positive ? 'text-green-600' : 'text-red-500'}`}>
                                {stat.change}
                                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            </div>
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</h3>
                        <p className="text-3xl font-black text-[#3D3028] tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#3D3028]">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] transition-all">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 text-sm font-bold text-[#3D3028]">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-8 py-5 text-sm text-gray-600 font-medium">{order.user?.name || 'Guest'}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-[#3D3028]">RS {order.totalPrice}</td>
                                        <td className="px-8 py-5">
                                            <span className={`
                                                px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'Shipped' ? 'bg-orange-100 text-orange-700' :
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No recent orders</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Status Breakthrough */}
                <div className="bg-[#3D3028] rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Order Distribution</h2>
                        <p className="text-[#E3CBC1] text-sm font-medium">Fulfillment tracking.</p>

                        <div className="mt-12 space-y-8">
                            <div>
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                                    <span>Processing</span>
                                    <span>{stats.orders ? Math.round((stats.processing / stats.orders) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#E3CBC1] relative transition-all duration-1000" style={{ width: `${stats.orders ? (stats.processing / stats.orders) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shine" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                                    <span>Delivered</span>
                                    <span>{stats.orders ? Math.round((stats.delivered / stats.orders) * 100) : 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#A88B7A] relative transition-all duration-1000 delay-300" style={{ width: `${stats.orders ? (stats.delivered / stats.orders) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shine" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[#E3CBC1] uppercase tracking-widest">Active Users</span>
                                <span className="text-2xl font-black">{stats.users}</span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
