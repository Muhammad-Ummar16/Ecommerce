import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Menu, User, Bell, Search } from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user.role === 'admin') {
                setAdmin(user);
            }
        }
        setLoading(false);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    if (loading) return null;

    if (!admin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-[#FDFBF9] flex">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 lg:ml-72 transition-all duration-300`}>

                {/* Admin Header / Top Bar */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 text-gray-500 hover:text-[#3D3028]"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 min-w-[300px]">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products, orders..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-[#3D3028] transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#3D3028]">{admin.name}</p>
                                <p className="text-[10px] uppercase font-black tracking-widest text-[#7A5C4A]">Manager</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#E3CBC1] flex items-center justify-center text-[#3D3028] font-bold border-2 border-[#3D3028]/10 shadow-sm overflow-hidden">
                                {admin.avatar?.url ? (
                                    <img src={admin.avatar.url} alt={admin.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
