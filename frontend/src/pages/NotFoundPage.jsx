import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import NavBar from '../components/NavBar';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center p-6 text-center">
            <NavBar />

            <div className="max-w-md w-full animate-fade-in pt-20">
                <div className="relative mb-8">
                    <h1 className="text-[150px] font-black text-[#3D3028]/5 leading-none select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-xl shadow-[#3D3028]/5 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <h2 className="text-2xl font-black text-[#3D3028] uppercase tracking-tighter">Lost in Style?</h2>
                        </div>
                    </div>
                </div>

                <p className="text-gray-500 font-medium mb-12 text-lg">
                    The page you're looking for seems to have vanished from our collection. Let's get you back on track.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <Link
                        to="/"
                        className="bg-[#3D3028] text-white py-4 px-8 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#2c221c] transition-all shadow-lg shadow-[#3D3028]/10"
                    >
                        <Home className="w-4 h-4" /> Go to Homepage
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="text-[#7A5C4A] py-4 px-8 rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#F4EBE6] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-[#E3CBC1]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed -top-20 -right-20 w-80 h-80 bg-[#7A5C4A]/10 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
};

export default NotFoundPage;
