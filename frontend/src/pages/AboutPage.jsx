import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { ArrowRight } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="bg-[#fcfaf8] min-h-screen pb-20 font-sans">
            <NavBar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
                <nav className="text-xs text-gray-500 mb-6 font-medium tracking-wider justify-center flex">
                    <Link to="/" className="hover:text-[#7A5C4A]">Home</Link> <span className="mx-2">/</span> <span className="text-gray-900">About Us</span>
                </nav>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#3D3028] uppercase tracking-tighter mb-6">
                    Our Story
                </h1>
                <p className="max-w-2xl text-lg text-gray-600 leading-relaxed font-medium">
                    We believe everyday essentials should be crafted with uncompromised quality, timeless design, and profound respect for the people who make them.
                </p>
            </div>

            {/* Image Feature */}
            <div className="px-4 xl:px-0 max-w-7xl mx-auto mb-20 md:mb-32">
                <div className="w-full h-[50vh] md:h-[70vh] rounded-[2rem] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1558769132-cb1fac08ce84?q=80&w=2938&auto=format&fit=crop"
                        alt="Our studio and craft"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Two Column Story Layout */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center mb-20 md:mb-32">
                <div>
                    <h2 className="text-3xl font-black text-[#3D3028] mb-6 tracking-tight">The Foundation</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        Born from a frustration with fast fashion, we set out to build a wardrobe of perfect fundamentals. No glaring logos, no seasonal trends—just meticulous construction, superior fabrics, and fits obsessed over down to the millimeter.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        Every piece we release has been prototyped, tested, and refined for months before it ever reaches your hands. We don't drop collections; we build a permanent, evolving uniform.
                    </p>
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1770&auto=format&fit=crop"
                        alt="Quality fabrics"
                        className="rounded-2xl shadow-sm w-full h-auto object-cover aspect-[4/5]"
                    />
                </div>
            </div>

            {/* Core Values */}
            <div className="bg-[#3D3028] py-20 md:py-32 text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Our Principles</h2>
                        <p className="text-[#a08a7c] max-w-xl mx-auto">The non-negotiable standards that govern everything we create.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-2xl font-black">01</div>
                            <h3 className="text-xl font-bold mb-4">Fabric First</h3>
                            <p className="text-white/70 leading-relaxed text-sm">We source from the world's finest mills, prioritizing weight, texture, and longevity over cost.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-2xl font-black">02</div>
                            <h3 className="text-xl font-bold mb-4">Ethical Craft</h3>
                            <p className="text-white/70 leading-relaxed text-sm">Partnering exclusively with factories that provide safe conditions and living wages.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 text-2xl font-black">03</div>
                            <h3 className="text-xl font-bold mb-4">Absolute Clarity</h3>
                            <p className="text-white/70 leading-relaxed text-sm">Radical transparency regarding our pricing, our sizing, and our entire supply chain.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / CTA section */}
            <div className="text-center py-20 md:py-32 px-4">
                <h2 className="text-3xl font-black text-[#3D3028] tracking-tight mb-8">Ready to upgrade your uniform?</h2>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-[#3D3028] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#2c221c] transition-all hover:gap-4">
                    Explore Collection <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default AboutPage;
