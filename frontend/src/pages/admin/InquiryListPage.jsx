import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Mail,
    Trash2,
    CheckCircle,
    Search,
    Clock,
    ChevronRight,
    User,
    Eye,
    Inbox,
    Star,
    Archive,
    Reply,
    MoreVertical,
    AlertCircle,
    MessageCircle,
} from 'lucide-react';
import { useInquiries } from '../../hooks/useAdminHooks';

const InquiryListPage = () => {
    const { data: inquiries = [], isLoading: loading, refetch } = useInquiries();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const handleUpdateStatus = async (id, status) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/contacts/${id}`, { status }, config);
            refetch();
            if (selectedInquiry?._id === id) {
                setSelectedInquiry(prev => ({ ...prev, status }));
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/contacts/${id}`, config);
            toast.success('Inquiry deleted');
            refetch();
            if (selectedInquiry?._id === id) setSelectedInquiry(null);
        } catch (err) {
            toast.error('Failed to delete inquiry');
        }
    };

    const filteredInquiries = inquiries.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Unread': return 'bg-orange-500 text-white';
            case 'Read': return 'bg-blue-500 text-white';
            case 'Replied': return 'bg-green-500 text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-6 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 flex-shrink-0">
                <div>
                    <h1 className="text-4xl font-black text-[#3D3028] uppercase tracking-tight">Support Inbox</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and respond to customer inquiries efficiently.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                    {['All', 'Unread', 'Read', 'Replied'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`
                                px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
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

            {/* Main Content: Split View */}
            <div className="flex-1 flex gap-8 overflow-hidden min-h-0">

                {/* Left Side: Message List (Scrollable) */}
                <div className={`flex-1 flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden ${selectedInquiry ? 'hidden lg:flex max-w-md' : 'flex'}`}>
                    <div className="p-6 border-b border-gray-50 flex-shrink-0">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3D3028] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full bg-[#fcfaf8] border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#3D3028]/10 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="px-6 py-5 space-y-3 animate-pulse">
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-50 rounded w-1/4"></div>
                                    </div>
                                    <div className="h-3 bg-gray-50 rounded w-3/4"></div>
                                </div>
                            ))
                        ) : filteredInquiries.length > 0 ? (
                            filteredInquiries.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => { setSelectedInquiry(item); if (item.status === 'Unread') handleUpdateStatus(item._id, 'Read'); }}
                                    className={`
                                        px-6 py-5 cursor-pointer transition-all border-b border-gray-50 last:border-none relative
                                        ${selectedInquiry?._id === item._id ? 'bg-[#3D3028] text-white' : 'hover:bg-gray-50 text-[#3D3028]'}
                                    `}
                                >
                                    {item.status === 'Unread' && selectedInquiry?._id !== item._id && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
                                    )}
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm font-black uppercase tracking-tight truncate flex-1 ${selectedInquiry?._id === item._id ? 'text-white' : 'text-[#3D3028]'}`}>
                                            {item.name}
                                        </p>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest flex-shrink-0 ml-2 ${selectedInquiry?._id === item._id ? 'text-white/50' : 'text-gray-400'}`}>
                                            {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className={`text-xs font-bold leading-tight line-clamp-1 mb-1 ${selectedInquiry?._id === item._id ? 'text-white/80' : 'text-gray-600'}`}>
                                        {item.subject}
                                    </p>
                                    <p className={`text-[10px] font-medium opacity-60 line-clamp-1 italic ${selectedInquiry?._id === item._id ? 'text-white' : 'text-gray-400'}`}>
                                        "{item.message}"
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-10 opacity-20">
                                <Inbox className="w-16 h-16 mb-4" />
                                <p className="font-black uppercase tracking-widest text-xs">Inbox is empty</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Message Detail */}
                <div className={`flex-[2] flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden ${!selectedInquiry ? 'hidden lg:flex items-center justify-center' : 'flex animate-slide-up'}`}>
                    {selectedInquiry ? (
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Detail Header */}
                            <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 flex-shrink-0">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-[#3D3028] flex items-center justify-center text-white shadow-lg shadow-[#3D3028]/20">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-[#3D3028] uppercase tracking-tight">{selectedInquiry.name}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className="text-xs font-bold text-gray-400">{selectedInquiry.email}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" /> {new Date(selectedInquiry.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${getStatusStyles(selectedInquiry.status)}`}>
                                        {selectedInquiry.status}
                                    </span>
                                    <div className="h-8 w-[1px] bg-gray-100 mx-2" />
                                    <button
                                        onClick={() => handleDelete(selectedInquiry._id)}
                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        title="Delete Message"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Detail Body */}
                            <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
                                <div className="space-y-12">
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Subject</span>
                                        <h4 className="text-2xl font-black text-[#3D3028] leading-tight">
                                            {selectedInquiry.subject}
                                        </h4>
                                    </div>

                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Message</span>
                                        <div className="bg-[#fcfaf8] p-10 rounded-[40px] text-lg leading-relaxed text-[#3D3028] font-medium border border-[#3D3028]/5 relative italic">
                                            <MessageCircle className="absolute -top-4 -left-4 w-12 h-12 text-[#3D3028]/5" />
                                            "{selectedInquiry.message}"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Footer: Quick Actions */}
                            <div className="p-8 border-t border-gray-50 flex-shrink-0 bg-[#FDFBF9]">
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedInquiry._id, 'Replied')}
                                        className="flex-1 bg-[#3D3028] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-[#3D3028]/20 flex items-center justify-center gap-3 group"
                                    >
                                        <Reply className="w-4 h-4 group-hover:-translate-x-1" /> Send Reply Email
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedInquiry._id, 'Read')}
                                        className="px-8 bg-white border border-gray-200 text-[#3D3028] py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Archive className="w-4 h-4" /> Move to Handled
                                    </button>
                                </div>
                                <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-6">
                                    This message was received through the public contact form
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-6 max-w-sm px-10 animate-fade-in">
                            <div className="w-32 h-32 bg-[#F4EBE6] rounded-[48px] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                <Mail className="w-12 h-12 text-[#3D3028] opacity-30" />
                            </div>
                            <h3 className="text-2xl font-black text-[#3D3028] uppercase tracking-tight">Select a Message</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Click on a conversation from the sidebar to view full details and respond to the customer.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InquiryListPage;
