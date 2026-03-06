import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#3D3028] text-[#E3CBC1] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="inline-block group">
                            <h3 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">MZ Wear</h3>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#7A5C4A] block mb-6 transition-colors group-hover:text-white">Premium Street Fashion</span>
                        </Link>
                        <p className="text-sm opacity-80 leading-relaxed max-w-sm mb-8">
                            Premium streetwear crafted for comfort and style. Redefine your everyday look with our exclusive, high-quality pieces.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#3D3028] transition-all hover:-translate-y-1">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#3D3028] transition-all hover:-translate-y-1">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#3D3028] transition-all hover:-translate-y-1">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="hidden md:block">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/shop" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">Shop Collection</Link></li>
                            <li><Link to="/new-arrivals" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">New Arrivals</Link></li>
                            <li><Link to="/about" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">About Our Story</Link></li>
                            <li><Link to="/contact" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div className="hidden md:block">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="#" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">Order Tracking</Link></li>
                            <li><Link to="#" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">Shipping & Returns</Link></li>
                            <li><Link to="/profile" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">My Account</Link></li>
                            <li><Link to="#" className="opacity-80 hover:opacity-100 hover:text-white hover:translate-x-1 inline-flex transition-all">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Setup */}
                    <div className="hidden md:block lg:col-span-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[#7A5C4A] mb-6">Stay In The Loop</h4>
                        <p className="text-sm opacity-80 leading-relaxed mb-6">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3CBC1]/50 text-white placeholder:text-white/30 transition-colors"
                            />
                            <button className="bg-white text-[#3D3028] px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#E3CBC1] transition-colors">
                                Subscribe <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Footer Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60 font-medium">
                    <p>&copy; {new Date().getFullYear()} MZ Wear. All rights reserved.</p>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        <div className="flex items-center gap-2 text-white">
                            <Mail className="w-4 h-4 text-[#7A5C4A]" /> support@mzwear.com
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
