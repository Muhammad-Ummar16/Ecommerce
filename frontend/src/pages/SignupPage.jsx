import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2, UserPlus } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/google-auth`, {
                idToken: credentialResponse.credential
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success(`Account created with Google! Welcome ${data.name}`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Google signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full">
                <div className="mb-8 text-center lg:text-left">
                    <h2 className="text-4xl font-black text-[#3D3028] mb-3 uppercase tracking-tight leading-tight">
                        Create <br /> account
                    </h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
                        Join the premium fashion movement
                    </p>
                </div>

                <div className="w-full flex justify-center lg:justify-start mb-6">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google signup failed')}
                        theme="outline"
                        size="large"
                        shape="pill"
                    />
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    <span className="text-[10px] text-gray-300 font-bold tracking-widest">START JOURNEY</span>
                    <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                ...

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 group">
                            <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="firstName">First Name</label>
                            <div className="relative">
                                <input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm placeholder:text-gray-300 relative z-10"
                                    required
                                />
                                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#E3CBC1] to-[#D0B8A8] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                            </div>
                        </div>
                        <div className="space-y-1.5 group">
                            <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="lastName">Last Name</label>
                            <div className="relative">
                                <input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm placeholder:text-gray-300 relative z-10"
                                    required
                                />
                                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#D0B8A8] to-[#E3CBC1] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="email">Email Address</label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm placeholder:text-gray-300 relative z-10"
                                required
                            />
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#E3CBC1] to-[#D0B8A8] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 group">
                            <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="phone">Phone</label>
                            <div className="relative">
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0300 0000000"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm placeholder:text-gray-300 relative z-10"
                                    required
                                />
                                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#D0B8A8] to-[#E3CBC1] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                            </div>
                        </div>
                        <div className="space-y-1.5 group">
                            <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="password">Security</label>
                            <div className="relative">
                                <div className="relative z-10">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-5 pr-12 py-3.5 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm tracking-[0.3em] placeholder:text-gray-300"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#3D3028] transition-colors"
                                    >
                                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#E3CBC1] to-[#D0B8A8] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="address">shipping address</label>
                        <div className="relative">
                            <input
                                id="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street, City, Country"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm placeholder:text-gray-300 relative z-10"
                                required
                            />
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#D0B8A8] to-[#E3CBC1] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3D3028] hover:bg-black text-white rounded-2xl py-4.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-[#3D3028]/10 hover:shadow-[#3D3028]/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-4 h-4 text-[#E3CBC1] group-hover:scale-125 transition-transform" />}
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>

                <p className="text-center text-[10px] font-bold text-gray-400 mt-8 uppercase tracking-widest relative z-10">
                    Part of the collection? <Link to="/login" className="text-[#3D3028] font-black hover:underline underline-offset-4">Log in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;
