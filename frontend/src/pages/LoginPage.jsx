import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
            <div className="w-full animate-fade-in">
                <h2 className="text-3xl font-bold text-[#3D3028] mb-2 text-center">Welcome Back</h2>
                <p className="text-sm text-gray-500 mb-8 text-center uppercase tracking-widest font-medium">Log in to your account</p>

                <div className="w-full flex justify-center mb-6">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed')}
                        theme="outline"
                        size="large"
                        shape="pill"
                        width="100%"
                    />
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">OR</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                ...

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1 ml-1" htmlFor="emailPhone">Email</label>
                        <input
                            id="emailPhone"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="johncanny@gmail.com"
                            className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1 ml-1" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm tracking-[0.2em]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 pb-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="w-4 h-4 border border-gray-300 rounded bg-white peer-checked:bg-[#7A5C4A] peer-checked:border-[#7A5C4A] transition-all"></div>
                                <svg className="absolute w-3 h-3 text-white left-0.5 top-0.5 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-xs text-gray-600 group-hover:text-[#7A5C4A] transition-colors">Remember Me</span>
                        </label>
                        <a href="#" className="text-xs text-gray-600 hover:text-[#7A5C4A] hover:underline transition-all">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6B5145] hover:bg-[#574438] text-white rounded-full py-3.5 text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-8">
                    Don't have an account? <Link to="/signup" className="text-[#6B5145] font-semibold hover:underline">Sign up</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
