import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
            <div className="w-full animate-fade-in fade-in-up">
                <h2 className="text-3xl font-bold text-[#3D3028] mb-2">Create Account</h2>
                <p className="text-sm text-gray-500 mb-6">Join Luxora today and explore 10,000+ products</p>

                <div className="w-full flex justify-center mb-5">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google signup failed')}
                        theme="outline"
                        size="large"
                        shape="pill"
                    />
                </div>

                <div className="flex items-center gap-4 mb-5">
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">OR</span>
                    <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                ...

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1 ml-1" htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-600 mb-1 ml-1" htmlFor="lastName">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1 ml-1" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="johncanny@gmail.com"
                            className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1 ml-1" htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1 ml-1" htmlFor="address">Address</label>
                        <input
                            id="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Luxury Ave, CA"
                            className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1 ml-1" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-white border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-sm outline-none focus:border-[#7A5C4A] focus:ring-1 focus:ring-[#7A5C4A] transition-all shadow-sm tracking-[0.2em]"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6B5145] hover:bg-[#574438] text-white rounded-full py-3 text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] mt-2! flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6 relative z-10">
                    Already have an account? <Link to="/login" className="text-[#6B5145] font-semibold hover:underline">Log in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;
