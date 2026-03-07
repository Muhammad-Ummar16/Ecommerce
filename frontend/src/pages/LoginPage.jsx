import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/google-auth`, {
                idToken: credentialResponse.credential
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success(`Logged in with Google! Welcome ${data.name}`);

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error('Google Login Failed. Please try again or use email.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/signin`, { email, password });

            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success(`Welcome back, ${data.name}!`);

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full">
                <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-4xl font-black text-[#3D3028] mb-3 uppercase tracking-tight leading-tight">
                        Welcome <br /> back
                    </h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
                        Access your premium workspace
                    </p>
                </div>

                <div className="w-full flex justify-center lg:justify-start mb-8">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed')}
                        theme="outline"
                        size="large"
                        shape="pill"
                    />
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    <span className="text-[10px] text-gray-300 font-bold tracking-widest">SECURE LOGIN</span>
                    <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                ...

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2 group">
                        <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="emailPhone">Email Address</label>
                        <div className="relative">
                            <input
                                id="emailPhone"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm placeholder:text-gray-300 relative z-10"
                                required
                            />
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#E3CBC1] to-[#D0B8A8] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="block text-[10px] font-black text-[#7A5C4A] uppercase tracking-widest ml-4 transition-colors group-focus-within:text-[#3D3028]" htmlFor="password">Security Key</label>
                        <div className="relative">
                            <div className="relative z-10">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-6 pr-14 py-4 text-sm font-bold text-[#3D3028] outline-none focus:bg-white focus:border-[#3D3028] focus:ring-[6px] focus:ring-[#3D3028]/5 transition-all duration-300 shadow-sm tracking-[0.3em] placeholder:text-gray-300"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#3D3028] transition-colors"
                                >
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#D0B8A8] to-[#E3CBC1] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-opacity duration-300" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="w-5 h-5 border border-gray-200 rounded-lg bg-white peer-checked:bg-[#3D3028] peer-checked:border-[#3D3028] transition-all"></div>
                                <svg className="absolute w-3.5 h-3.5 text-[#E3CBC1] left-[3px] top-[3px] opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#3D3028] transition-colors">Keep me signed in</span>
                        </label>
                        <a href="#" className="text-[11px] font-black text-[#7A5C4A] uppercase tracking-widest hover:text-[#3D3028] transition-all">Recovery</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3D3028] hover:bg-black text-white rounded-2xl py-5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-[#3D3028]/10 hover:shadow-[#3D3028]/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-[#E3CBC1] group-hover:scale-125 transition-transform" />}
                        {loading ? 'Authenticating...' : 'Sign In Now'}
                    </button>
                </form>

                <p className="text-center text-[10px] font-bold text-gray-400 mt-10 uppercase tracking-widest">
                    New to the collection? <Link to="/signup" className="text-[#3D3028] font-black hover:underline underline-offset-4">Create Account</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
