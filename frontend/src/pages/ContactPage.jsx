import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle2, ArrowLeft } from 'lucide-react';
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

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Us",
            detail: "support@shopping.com",
            subDetail: "Online support 24/7",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: Phone,
            title: "Call Us",
            detail: "+92 300 1234567",
            subDetail: "Mon-Sat, 9am - 6pm",
            color: "bg-green-50 text-green-600"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            detail: "Gulberg III, Lahore",
            subDetail: "Pakistan, 54000",
            color: "bg-orange-50 text-orange-600"
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-4 space-y-6">
                        {contactInfo.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
                            >
                                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-[#3D3028] uppercase tracking-tight mb-2">{item.title}</h3>
                                <p className="text-[#3D3028] font-bold mb-1">{item.detail}</p>
                                <p className="text-gray-400 text-sm font-medium">{item.subDetail}</p>
                            </div>
                        ))}

                        {/* Social Links / Extra Info */}
                        <div className="bg-[#3D3028] p-8 rounded-[32px] text-white shadow-2xl shadow-[#3D3028]/20">
                            <h3 className="text-lg font-black uppercase tracking-widest mb-6">Connect with us</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors cursor-pointer group">
                                    <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="font-bold text-sm tracking-wide">www.shopping.com</span>
                                </div>
                                <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors cursor-pointer group">
                                    <Clock className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span className="font-bold text-sm tracking-wide">9:00 AM - 6:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 md:p-12 rounded-[48px] border border-gray-100 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4EBE6]/50 rounded-bl-[100px] -z-0" />

                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="relative z-10 space-y-8 w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] ml-2">Your Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                                className="w-full bg-[#fcfaf8] border-none rounded-2xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] ml-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                                className="w-full bg-[#fcfaf8] border-none rounded-2xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] ml-2">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="How can we help?"
                                            className="w-full bg-[#fcfaf8] border-none rounded-2xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] ml-2">Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows="6"
                                            placeholder="Type your message here..."
                                            className="w-full bg-[#fcfaf8] border-none rounded-2xl px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-[#3D3028] transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto bg-[#3D3028] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black hover:shadow-2xl hover:shadow-[#3D3028]/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="relative z-10 text-center space-y-8 py-10 animate-fade-in w-full">
                                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl shadow-green-100">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-[#3D3028] uppercase tracking-tighter">Thank You!</h2>
                                        <p className="text-gray-500 font-medium max-w-sm mx-auto">
                                            Your message has been received successfully. Our team will get back to you via email within 24 hours.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#7A5C4A] hover:text-[#3D3028] bg-gray-50 hover:bg-white px-8 py-4 rounded-2xl border border-gray-100 transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Send another message
                                    </button>
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
