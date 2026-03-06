import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#D0B8A8] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex overflow-hidden min-h-[600px] sm:min-h-[700px]">
                {/* Left Form Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative">
                    <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
                        <h1 className="text-xl font-bold tracking-widest text-[#574438]">LUXORA</h1>
                    </div>
                    <div className="mt-12 sm:mt-16 w-full max-w-md mx-auto">
                        {children}
                    </div>
                </div>

                {/* Right Image Section */}
                <div className="hidden lg:block lg:w-1/2 relative bg-[#E3CBC1]">
                    {/* using the generated aesthetic image from the public folder */}
                    <img
                        src="/auth-side.png"
                        alt="Interior Chair"
                        className="absolute inset-0 w-full h-full object-cover rounded-r-3xl"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"; // fallback
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
