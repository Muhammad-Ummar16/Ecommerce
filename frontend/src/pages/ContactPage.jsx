import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle2, ArrowLeft, Instagram, Facebook } from 'lucide-react';
import NavBar from '../components/NavBar';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/contacts`, formData);
            toast.success('Message sent! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSubmitted(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const contactMethods = [
        {
            icon: Phone,
            title: "Call Us",
            detail: "+92 300 1234567",
            link: "tel:+923001234567",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            detail: "Gulberg III, Lahore",
            link: "https://maps.google.com",
            color: "bg-orange-50 text-orange-600"
        },
        {
            icon: Instagram,
            title: "Instagram",
            detail: "@mzwear_official",
            link: "https://instagram.com",
            color: "bg-pink-50 text-pink-600"
        },
        {
            icon: Facebook,
            title: "Facebook",
            detail: "MZ Wear Official",
            link: "https://facebook.com",
            color: "bg-blue-50 text-blue-800"
        }
    ];

    return (
        <div className="bg-[#fcfaf8] min-h-screen">
            <NavBar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#F4EBE6]/50 to-transparent rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm mb-6 animate-fade-in">
                        <MessageSquare className="w-4 h-4 text-[#3D3028]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#3D3028]">Get in Touch</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-[#3D3028] uppercase tracking-tighter mb-6 animate-slide-up">
                        Let's Start a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D3028] to-[#7A5C4A]">Conversation</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-500 font-medium text-lg animate-slide-up animation-delay-100">
                        Have a question about our products or need assistance with an order?
                        Our team is here to help you every step of the way.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Side: Contact Methods Grid */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {contactMethods.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center"
                                >
                                    <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xs font-black text-[#3D3028] uppercase tracking-widest mb-1">{item.title}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold truncate w-full">{item.detail}</p>
                                </a>
                            ))}
                        </div>

                        {/* Additional Info Minimal */}
                        <div className="bg-[#3D3028] p-8 rounded-[32px] text-white shadow-xl shadow-[#3D3028]/10 overflow-hidden relative">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-[#E3CBC1]">Quick Response</h3>
                                    <p className="text-xs text-white/60 font-medium">Average response time: 2 hours</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-white/80 transition-colors cursor-pointer group">
                                        <Globe className="w-4 h-4 text-[#7A5C4A]" />
                                        <span className="font-bold text-[10px] tracking-widest uppercase">support@mzwear.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/80 transition-colors cursor-pointer group">
                                        <Clock className="w-4 h-4 text-[#7A5C4A]" />
                                        <span className="font-bold text-[10px] tracking-widest uppercase">9:00 AM - 6:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Contact Form Section */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                            {!submitted ? (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-6 bg-[#7A5C4A] rounded-full" />
                                        <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Drop a Message</h2>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows="4"
                                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#3D3028] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#2c221c] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[#3D3028]/10"
                                        >
                                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Shoot Message'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="text-center py-10 space-y-6">
                                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#3D3028] uppercase tracking-tight">Sent Successfully</h2>
                                    <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto">We've received your request and will reach out shortly.</p>
                                    <button onClick={() => setSubmitted(false)} className="text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028]">Send New Message</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContactPage;
