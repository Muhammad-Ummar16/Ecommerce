import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';

const AuthLayout = ({ children }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for the cursor follow effect
    const springConfig = { damping: 25, stiffness: 150 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden relative selection:bg-[#3D3028] selection:text-white">
            {/* Interactive Background Canvas */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Fixed Background Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E3CBC1]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D0B8A8]/10 rounded-full blur-[150px]" />

                {/* Cursor Following Blobs */}
                <motion.div
                    style={{
                        x: cursorX,
                        y: cursorY,
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                    className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#E3CBC1]/30 to-transparent rounded-full blur-[100px] mix-blend-multiply opacity-60"
                />
                <motion.div
                    style={{
                        x: cursorX,
                        y: cursorY,
                        translateX: '-20%',
                        translateY: '-80%',
                    }}
                    className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#D0B8A8]/20 to-transparent rounded-full blur-[80px] mix-blend-soft-light opacity-40"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Content Container with Neon Ring */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl bg-white/70 backdrop-blur-[40px] rounded-[3rem] shadow-[0_32px_80px_rgba(61,48,40,0.1)] flex overflow-hidden min-h-[650px] sm:min-h-[750px] border border-white/40 relative z-10 group/card"
            >
                {/* Neon Ring Effect */}
                <div className="absolute -inset-[2px] rounded-[3rem] bg-gradient-to-r from-[#E3CBC1] via-[#D0B8A8] to-[#E3CBC1] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 blur-sm z-[-1]" />
                <div className="absolute -inset-[1px] rounded-[3rem] bg-gradient-to-r from-[#E3CBC1] via-[#D0B8A8] to-[#E3CBC1] opacity-30 z-[-1]" />

                {/* Left Form Section */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center relative">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute top-10 left-10 sm:top-14 sm:left-14"
                    >
                        <Link to="/" className="group flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#3D3028] rounded-lg flex items-center justify-center text-[#E3CBC1] font-black text-sm group-hover:scale-110 transition-transform">MZ</div>
                            <h1 className="text-xl font-black tracking-[0.4em] text-[#3D3028] mt-1">WEAR</h1>
                        </Link>
                    </motion.div>

                    <div className="w-full max-w-md mx-auto pt-16">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={window.location.pathname}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Visual Section */}
                <div className="hidden lg:block lg:w-1/2 relative overflow-hidden group">
                    <motion.div
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop"
                            alt="Fashion Model"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#3D3028]/60 via-[#3D3028]/20 to-transparent" />
                        <div className="absolute inset-0 backdrop-grayscale-[0.2] group-hover:backdrop-grayscale-0 transition-all duration-1000" />
                    </motion.div>

                    <div className="absolute inset-0 flex flex-col justify-end p-16 text-white z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            <div className="w-12 h-1 bg-[#E3CBC1] rounded-full" />
                            <h2 className="text-5xl font-black tracking-tight leading-[0.9] uppercase">
                                Redefining <br />
                                <span className="text-[#E3CBC1]">Modern</span> Fashion
                            </h2>
                            <p className="text-sm font-medium text-white/70 leading-relaxed max-w-xs uppercase tracking-widest">
                                High-end craftsmanship meets contemporary streetwear culture. Join the movement.
                            </p>

                            <div className="pt-4 flex items-center gap-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#3D3028] bg-gray-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E3CBC1]">Joined by 10k+ Fashionistas</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

import { Link } from 'react-router-dom';
export default AuthLayout;
