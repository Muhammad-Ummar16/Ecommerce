import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Search,
    Filter,
    Eye,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Calendar,
    User,
    ArrowUpRight,
    Download
} from 'lucide-react';
import { exportToExcel, formatOrderData } from '../../utils/ExcelExport';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [exportLoading, setExportLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/all`, config);
            setOrders(data);
        } catch (err) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        try {
            setExportLoading(true);
            const formatted = formatOrderData(filteredOrders);
            exportToExcel(formatted, 'Orders_Report', 'Orders', [
                { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 30 }, { wch: 15 }
            ]);
            toast.success('Order report downloaded');
        } catch (err) {
            toast.error('Failed to export orders');
        } finally {
            setExportLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusColors = {
        'Pending': 'bg-gray-100 text-gray-700',
        'Processing': 'bg-blue-50 text-blue-600',
        'Shipped': 'bg-orange-50 text-orange-600',
        'Delivered': 'bg-green-50 text-green-600',
        'Cancelled': 'bg-red-50 text-red-600'
    };

    const statusIcons = {
        'Pending': Clock,
        'Processing': CheckCircle2,
        'Shipped': Truck,
        'Delivered': CheckCircle2,
        'Cancelled': XCircle
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#3D3028] uppercase tracking-tight">Orders</h1>
                    <p className="text-gray-500 font-medium mt-1">Track and manage customer shipments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={exportLoading || orders.length === 0}
                        className="flex items-center gap-2 bg-white border border-gray-100 text-[#3D3028] px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        {exportLoading ? (
                            <div className="w-4 h-4 border-2 border-[#3D3028] border-t-transparent animate-spin rounded-full" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Export Excel
                    </button>
                    <div className="bg-[#3D3028] text-white px-4 py-2 rounded-xl shadow-lg shadow-[#3D3028]/20 flex items-center gap-2 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{orders.length} Total Orders</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3D3028] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer name..."
                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all shadow-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
                    {['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`
                                px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                                ${statusFilter === status
                                    ? 'bg-[#3D3028] text-white shadow-lg shadow-[#3D3028]/10'
                                    : 'text-[#7A5C4A] hover:bg-gray-50'}
                            `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDFBF9]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Order Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6" colSpan="6">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => {
                                    const StatusIcon = statusIcons[order.status] || Clock;
                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#F4EBE6] flex items-center justify-center text-[#3D3028]">
                                                        <ShoppingBag className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#3D3028]">#{order._id.slice(-6).toUpperCase()}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{order.orderItems.length} Items</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#3D3028]">{order.user?.name || 'Guest User'}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">{order.user?.email || 'No email'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <p className="font-black text-[#3D3028]">RS {order.totalPrice}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`
                                                    px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5 w-fit
                                                    ${statusColors[order.status]}
                                                `}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link
                                                    to={`/admin/orders/${order._id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#3D3028] hover:bg-[#3D3028] hover:text-white hover:shadow-lg transition-all"
                                                >
                                                    View <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <ShoppingBag className="w-12 h-12" />
                                            <p className="font-bold text-[#3D3028] uppercase tracking-widest text-xs">No orders found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Placeholder */}
                <div className="p-8 border-t border-gray-50 flex items-center justify-between bg-[#FDFBF9]/50">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        Showing {filteredOrders.length} of {orders.length} Results
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 border border-gray-100 rounded-xl text-gray-400 hover:text-[#3D3028] hover:bg-gray-50 disabled:opacity-30" disabled>
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 border border-gray-100 rounded-xl text-gray-400 hover:text-[#3D3028] hover:bg-gray-50 disabled:opacity-30" disabled>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderListPage;
