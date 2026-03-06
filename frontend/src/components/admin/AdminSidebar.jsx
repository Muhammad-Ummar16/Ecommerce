import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    MessageSquare
} from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
        { name: 'Categories', icon: Layers, path: '/admin/categories' },
        { name: 'Orders', icon: ClipboardList, path: '/admin/orders' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-72 bg-[#3D3028] text-white z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8 border-b border-white/10 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black uppercase tracking-tighter leading-none text-white">MZ Wear</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E3CBC1] mt-1">Admin Panel</span>
                        </div>
                        <button onClick={toggleSidebar} className="lg:hidden text-white/50 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) => `
                                    flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group
                                    ${isActive
                                        ? 'bg-[#524137] text-white shadow-lg'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                                <span className="font-bold text-sm tracking-wide uppercase">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 space-y-2">
                        <NavLink
                            to="/admin/settings"
                            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
                            <span className="font-bold text-sm tracking-wide uppercase">Settings</span>
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                        >
                            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <span className="font-bold text-sm tracking-wide uppercase text-left">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
