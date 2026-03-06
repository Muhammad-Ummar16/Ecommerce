import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import NavBar from '../components/NavBar';

const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        addresses: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) {
                window.location.href = '/login';
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, config);
            setProfile(data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, profile, config);

            // Update local storage with new name/email if they changed
            const updatedUserInfo = { ...userInfo, name: data.name, email: data.email };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            setProfile(data);
            toast.success('Profile updated successfully!');

            // Trigger storage event for NavBar to pick up changes
            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleAddressChange = (index, field, value) => {
        const newAddresses = [...profile.addresses];
        newAddresses[index][field] = value;
        setProfile({ ...profile, addresses: newAddresses });
    };

    const addAddress = () => {
        setProfile({
            ...profile,
            addresses: [
                ...profile.addresses,
                { fullName: '', phone: '', street: '', city: '', postalCode: '', country: '' }
            ]
        });
    };

    const removeAddress = (index) => {
        const newAddresses = profile.addresses.filter((_, i) => i !== index);
        setProfile({ ...profile, addresses: newAddresses });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfaf8] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#3D3028]" />
            </div>
        );
    }

    return (
        <div className="bg-[#fcfaf8] min-h-screen pb-20">
            <NavBar />

            <div className="max-w-4xl mx-auto px-4 pt-32">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#3D3028] p-8 md:p-12 text-white">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Account Settings</h1>
                        <p className="text-[#E3CBC1] mt-2 font-medium">Manage your personal information and addresses</p>
                    </div>

                    <form onSubmit={handleUpdate} className="p-8 md:p-12 space-y-12">

                        {/* Basic Information */}
                        <section>
                            <h2 className="text-xl font-bold text-[#3D3028] mb-6 flex items-center gap-2">
                                <User className="w-5 h-5" /> Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={profile.email}
                                            readOnly
                                            className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={profile.phone || ''}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="+92 300 1234567"
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#3D3028] transition-all"
                                        />
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Addresses */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#3D3028] flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> Shipping Addresses
                                </h2>
                                <button
                                    type="button"
                                    onClick={addAddress}
                                    className="text-xs font-bold uppercase tracking-wider text-[#7A5C4A] hover:text-[#3D3028] flex items-center gap-1 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add New
                                </button>
                            </div>

                            <div className="space-y-8">
                                {profile.addresses.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic py-4 bg-gray-50 rounded-2xl text-center border-2 border-dashed border-gray-100">No addresses added yet.</p>
                                ) : (
                                    profile.addresses.map((address, index) => (
                                        <div key={index} className="relative bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-fade-in">
                                            <button
                                                type="button"
                                                onClick={() => removeAddress(index)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Full Name</label>
                                                    <input
                                                        type="text"
                                                        value={address.fullName}
                                                        onChange={(e) => handleAddressChange(index, 'fullName', e.target.value)}
                                                        className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#3D3028]"
                                                        placeholder="Recipient Name"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={address.phone}
                                                        onChange={(e) => handleAddressChange(index, 'phone', e.target.value)}
                                                        className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#3D3028]"
                                                        placeholder="Phone Number"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Street Address</label>
                                                    <input
                                                        type="text"
                                                        value={address.street}
                                                        onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                                                        className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#3D3028]"
                                                        placeholder="House#, Street, Area"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:col-span-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">City</label>
                                                        <input
                                                            type="text"
                                                            value={address.city}
                                                            onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                                                            className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#3D3028]"
                                                            placeholder="City"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Postal Code</label>
                                                        <input
                                                            type="text"
                                                            value={address.postalCode}
                                                            onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                                                            className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#3D3028]"
                                                            placeholder="Zip/Postal"
                                                        />
                                                    </div>
                                                    <div className="space-y-1 col-span-2 md:col-span-1">
                                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Country</label>
                                                        <input
                                                            type="text"
                                                            value={address.country}
                                                            onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                                                            className="w-full bg-white border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#3D3028]"
                                                            placeholder="Country"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full bg-[#3D3028] hover:bg-[#2c221c] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm flex justify-center items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-[#3D3028]/10"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
