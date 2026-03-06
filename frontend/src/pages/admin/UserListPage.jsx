import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Search,
    User,
    Mail,
    Phone,
    Shield,
    Trash2,
    UserCheck,
    UserX,
    MoreVertical,
    Calendar,
    ArrowUpRight,
    Loader2
} from 'lucide-react';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, config);
            setUsers(data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteHandler = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                };
                await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, config);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#3D3028] uppercase tracking-tight">User Management</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your customer base and permissions.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-[#3D3028]">{users.length} Active Users</span>
                </div>
            </div>

            {/* Search Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3D3028] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all shadow-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* User Grid/Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDFBF9]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">User Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Contact Info</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Joined Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6" colSpan="5">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#F4EBE6] flex items-center justify-center text-[#3D3028] font-black text-lg">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#3D3028]">{user.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">ID: {user._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-3.5 h-3.5" /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Phone className="w-3 h-3" /> {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`
                                                px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1.5 w-fit
                                                ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}
                                            `}>
                                                <Shield className="w-3 h-3" />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    className="p-2.5 text-gray-400 hover:text-[#3D3028] hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
                                                    title="View Details"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => deleteHandler(user._id, user.name)}
                                                        className="p-2.5 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-600"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <UserX className="w-12 h-12" />
                                            <p className="font-bold text-[#3D3028] uppercase tracking-widest text-xs">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListPage;
