import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';


import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const NavBar = () => {
    const { cartItems, removeFromCart, itemsPrice } = useCart();
    const { wishlistItems } = useWishlist();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    // Hover states for dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null); // 'categories', 'profile', 'cart'

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
    }, [location.pathname]); // Re-check on navigation

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        navigate('/login');
    };

    // Listen to scroll to make navbar sticky and change background
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            {/* 1. Announcement Bar */}
            <div className="bg-[#3D3028] text-[#E3CBC1] text-xs font-medium py-2 px-4 text-center tracking-wider w-full z-50 relative">
                <p className="animate-pulse">🚚 Free Shipping Over Rs. 5000 | New Winter Collection is Out!</p>
            </div>

            {/* 2. Main Navigation Bar */}
            <nav
                className={`fixed w-full z-40 transition-all duration-300 ${isScrolled || !isHomePage
                    ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' // Solid/Glassomorphic when scrolled
                    : 'bg-transparent py-6' // Transparent at top (good for hero sections)
                    }`}
                style={{ top: isScrolled ? '0px' : '32px' }} // Remove gap when scrolled
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">

                        {/* Mobile Menu Toggle (Left) */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className={`p-2 rounded-md ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>

                        {/* Left/Center: Brand Logo */}
                        <div className="flex-shrink-0 flex items-center justify-center md:justify-start flex-1 md:flex-none">
                            <Link to="/" className="flex flex-col items-center md:items-start group">
                                <span className={`text-2xl font-black tracking-tighter uppercase transition-colors ${isScrolled || !isHomePage ? 'text-[#3D3028]' : 'text-[#3D3028] lg:text-white'
                                    }`}>
                                    MZ Wear
                                </span>
                                <span className={`text-[9px] uppercase tracking-[0.3em] font-medium transition-colors ${isScrolled || !isHomePage ? 'text-[#7A5C4A]' : 'text-[#7A5C4A] lg:text-gray-200'
                                    } opacity-0 group-hover:opacity-100 transition-opacity absolute mt-8`}>
                                    Premium Street Fashion
                                </span>
                            </Link>
                        </div>

                        {/* Center: Desktop Navigation Links */}
                        <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
                            <Link to="/" className={`text-sm font-medium hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>Home</Link>
                            <Link to="/shop" className={`text-sm font-medium hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>Shop</Link>
                            <Link to="/collections" className={`text-sm font-medium hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>Collections</Link>
                            <Link to="/new-arrivals" className={`text-sm font-medium hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>New Arrivals</Link>
                            <Link to="/about" className={`text-sm font-medium hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>About Us</Link>
                            <Link to="/contact" className={`text-sm font-medium hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>Contact</Link>
                        </div>

                        {/* Right: Icons */}
                        <div className="flex items-center justify-end space-x-4 md:space-x-6">

                            {/* Search Icon / Input */}
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`absolute right-8 top-1/2 -translate-y-1/2 bg-gray-100/80 backdrop-blur-sm border-none rounded-full px-4 text-sm transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#7A5C4A] ${isSearchOpen ? 'w-48 md:w-64 opacity-100 py-1.5' : 'w-0 opacity-0 pointer-events-none py-0'
                                        }`}
                                />
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`p-1 hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}
                                >
                                    {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Wishlist Icon */}
                            <Link to="/wishlist" className={`relative p-1 hover:text-red-500 transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>
                                <Heart className="w-5 h-5 md:w-5 md:h-5" />
                                <span className="absolute -top-1 -right-1.5 bg-[#7A5C4A] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlistItems.length}
                                </span>
                            </Link>

                            {/* Cart Icon & Mini Cart */}
                            <div
                                className="relative py-6 -my-6"
                                onMouseEnter={() => setActiveDropdown('cart')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link to="/cart" className={`relative p-1 flex items-center hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>
                                    <ShoppingBag className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1.5 bg-[#3D3028] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                        {cartItems.length}
                                    </span>
                                </Link>

                                {/* Mini Cart Dropdown (Desktop) */}
                                <div
                                    className={`hidden md:block absolute top-[80%] right-0 w-80 bg-white shadow-xl rounded-xl p-4 transition-all duration-300 origin-top-right z-50 border border-gray-100 ${activeDropdown === 'cart' ? 'opacity-100 scale-100 visible translate-y-2' : 'opacity-0 scale-95 invisible translate-y-0'
                                        }`}
                                >
                                    <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">Your Cart ({cartItems.length})</h4>
                                    {cartItems.length > 0 ? (
                                        <>
                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                                {cartItems.map(item => (
                                                    <div key={`${item._id}-${item.color}-${item.size}`} className="flex gap-3 relative group">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                                        <div className="flex-1">
                                                            <h5 className="text-sm font-semibold text-gray-800 leading-tight pr-5">{item.name}</h5>
                                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                                                            <p className="text-sm font-bold text-[#7A5C4A] mt-1">Rs. {item.price}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item._id, item.color, item.size)}
                                                            className="absolute right-0 top-0 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="border-t mt-3 pt-3 flex justify-between items-center mb-4">
                                                <span className="text-sm font-semibold text-gray-500">Subtotal</span>
                                                <span className="text-base font-bold text-gray-800">
                                                    Rs. {itemsPrice}
                                                </span>
                                            </div>
                                            <Link to="/checkout" className="w-full block text-center bg-[#3D3028] hover:bg-[#2c221c] text-white text-sm font-semibold py-3 rounded-full transition-colors">
                                                Checkout
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="text-center py-6 text-gray-500 text-sm">Your cart is empty.</div>
                                    )}
                                </div>
                            </div>

                            {/* User Profile / Auth */}
                            <div
                                className="relative py-6 -my-6 hidden md:block" // Hidden on mobile, added to mobile menu menu
                                onMouseEnter={() => setActiveDropdown('profile')}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {userInfo ? (
                                    <button className={`relative p-1 flex items-center hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>
                                        <div className="w-8 h-8 rounded-full border-2 border-[#7A5C4A] flex items-center justify-center overflow-hidden">
                                            {userInfo.avatar?.url ? (
                                                <img src={userInfo.avatar.url} alt={userInfo.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold text-[#7A5C4A]">{userInfo.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                    </button>
                                ) : (
                                    <Link to="/login" className={`relative p-1 flex items-center hover:text-[#7A5C4A] transition-colors ${isScrolled || !isHomePage ? 'text-gray-800' : 'text-gray-800 lg:text-white'}`}>
                                        <User className="w-5 h-5" />
                                    </Link>
                                )}

                                {/* Profile Dropdown */}
                                {userInfo && (
                                    <div
                                        className={`absolute top-[80%] right-0 w-56 bg-white shadow-xl rounded-xl py-2 transition-all duration-300 origin-top-right z-50 border border-gray-100 ${activeDropdown === 'profile' ? 'opacity-100 scale-100 visible translate-y-2' : 'opacity-0 scale-95 invisible translate-y-0'
                                            }`}
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                                            <p className="text-sm font-bold text-gray-800">{userInfo.name}</p>
                                            <p className="text-[10px] text-gray-500 truncate mt-0.5">{userInfo.email}</p>
                                            {userInfo.role === 'admin' && (
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-[#7A5C4A]/10 text-[#7A5C4A] text-[9px] font-bold rounded uppercase">Admin</span>
                                            )}
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A5C4A]">My Profile</Link>
                                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A5C4A]">My Orders</Link>
                                        <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A5C4A]">Wishlist</Link>
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </nav>

            {/* 3. Mobile Navigation Menu (Side Drawer) */}
            <div className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMobileMenu}>
                <div
                    className={`absolute top-0 left-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    {/* Mobile Menu Header */}
                    <div className="p-5 flex items-center justify-between border-b border-gray-100">
                        <span className="text-xl font-black tracking-tighter uppercase text-[#3D3028]">MZ Wear</span>
                        <button onClick={toggleMobileMenu} className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-2">
                        <Link to="/" className="text-lg font-medium text-gray-800 py-3 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/shop" className="text-lg font-medium text-gray-800 py-3 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                        <Link to="/collections" className="text-lg font-medium text-gray-800 py-3 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
                        <Link to="/new-arrivals" className="text-lg font-medium text-gray-800 py-3 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
                        <Link to="/about" className="text-lg font-medium text-gray-800 py-3 border-b border-gray-50" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                        <Link to="/contact" className="text-lg font-medium text-gray-800 py-3" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    </div>

                    {/* Mobile Menu Footer (Auth) */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                        {userInfo ? (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-[#3D3028] rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                                        {userInfo.avatar?.url ? (
                                            <img src={userInfo.avatar.url} alt={userInfo.name} className="w-full h-full object-cover" />
                                        ) : (
                                            userInfo.name?.charAt(0)
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{userInfo.name}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{userInfo.email}</p>
                                    </div>
                                </div>
                                <Link to="/profile" className="text-sm font-medium text-gray-700 py-2" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                                <Link to="/orders" className="text-sm font-medium text-gray-700 py-2" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                                <button
                                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                    className="text-sm font-semibold text-red-500 py-2 text-left flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" className="flex-1 bg-white border border-[#3D3028] text-[#3D3028] text-center text-sm font-semibold py-3 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                <Link to="/signup" className="flex-1 bg-[#3D3028] text-white text-center text-sm font-semibold py-3 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;
