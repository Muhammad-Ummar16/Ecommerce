import React, { useState, useEffect } from 'react';
import { Save, Phone, Globe, Info, Loader2, CheckCircle2, Clock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';

const SettingsPage = () => {
    const { settings, updateSettings, loading: settingsLoading } = useSettings();
    const [formData, setFormData] = useState({
        whatsappNumber: '',
        siteName: '',
        orderDeliveryDays: '',
        siteUrl: ''
    });
    const [savingType, setSavingType] = useState(null); // 'general', 'whatsapp', 'order'

    useEffect(() => {
        if (settings) {
            setFormData({
                whatsappNumber: settings.whatsappNumber || '',
                siteName: settings.siteName || '',
                orderDeliveryDays: settings.orderDeliveryDays || '',
                siteUrl: settings.siteUrl || ''
            });
        }
    }, [settings]);

    const handleSave = async (type, data) => {
        setSavingType(type);
        const result = await updateSettings(data);
        if (result.success) {
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} settings updated`);
        } else {
            toast.error(result.message);
        }
        setSavingType(null);
    };

    if (settingsLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#3D3028]" />
                <p className="font-bold text-[#3D3028] uppercase tracking-widest text-xs">Loading Settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight">Site Settings</h1>
                <p className="text-gray-500 font-medium text-sm">Manage individual configurations for your storefront.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">

                    {/* General Settings Section */}
                    <section className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-[#A88B7A] rounded-full"></div>
                                <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">General Info</h2>
                            </div>
                            <button
                                onClick={() => handleSave('general', { siteName: formData.siteName, siteUrl: formData.siteUrl })}
                                disabled={savingType === 'general'}
                                className="flex items-center gap-2 bg-[#3D3028] text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all disabled:opacity-50"
                            >
                                {savingType === 'general' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Save
                            </button>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] ml-1">
                                <Globe className="w-3.5 h-3.5" /> Site Name
                            </label>
                            <input
                                type="text"
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                placeholder="e.g. MZ Wear"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all font-bold text-[#3D3028]"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] ml-1">
                                <Globe className="w-3.5 h-3.5" /> Production Site URL
                            </label>
                            <input
                                type="text"
                                value={formData.siteUrl}
                                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                                placeholder="e.g. https://mzwear.pk"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all font-bold text-[#3D3028]"
                            />
                            <p className="text-[10px] text-gray-400 font-medium ml-1 italic">Used for WhatsApp sharing links to avoid 'localhost'.</p>
                        </div>
                    </section>

                    {/* WhatsApp Integration Section */}
                    <section className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                                <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">WhatsApp Contact</h2>
                            </div>
                            <button
                                onClick={() => handleSave('whatsapp', { whatsappNumber: formData.whatsappNumber })}
                                disabled={savingType === 'whatsapp'}
                                className="flex items-center gap-2 bg-[#36B37E] text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#208B5D] transition-all disabled:opacity-50"
                            >
                                {savingType === 'whatsapp' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Save
                            </button>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] ml-1">
                                <Phone className="w-3.5 h-3.5" /> WhatsApp Number
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.whatsappNumber}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                    placeholder="e.g. +923001234567"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all font-bold text-[#3D3028]"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">Live Support</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium ml-1 italic">Used for all product inquiries on the storefront.</p>
                        </div>
                    </section>

                    {/* Order & Email Settings Section */}
                    <section className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Order & Tracking</h2>
                            </div>
                            <button
                                onClick={() => handleSave('order', { orderDeliveryDays: formData.orderDeliveryDays })}
                                disabled={savingType === 'order'}
                                className="flex items-center gap-2 bg-[#0052CC] text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#0747A6] transition-all disabled:opacity-50"
                            >
                                {savingType === 'order' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Save
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] ml-1">
                                    <Clock className="w-3.5 h-3.5" /> Delivery Timeframe (Days)
                                </label>
                                <input
                                    type="text"
                                    value={formData.orderDeliveryDays}
                                    onChange={(e) => setFormData({ ...formData, orderDeliveryDays: e.target.value })}
                                    placeholder="e.g. 5"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all font-bold text-[#3D3028]"
                                />
                                <p className="text-[10px] text-gray-400 font-medium ml-1">This value is injected into the automated order confirmation email.</p>
                            </div>

                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-[#3D3028] uppercase tracking-wide mb-1">Static Email Configuration</h4>
                                    <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                                        The order confirmation email content is now standardized for better delivery. It automatically fetches the Customer Name, Order ID, and Total Price. Only the estimated delivery days can be customized here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#3D3028] p-8 rounded-[32px] text-white space-y-6 shadow-xl shadow-[#3D3028]/20">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#E3CBC1]" />
                            <h3 className="font-black uppercase tracking-tight text-lg">Infrastructure</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">SMTP Server</span>
                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-green-500/20 text-green-400 rounded">connected</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Site ID</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#E3CBC1]">MZ-WEAR-CMS</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Service Sync</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">100%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#FAF7F5] p-8 rounded-[32px] border border-[#EBDDD5] space-y-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <Info className="w-6 h-6 text-[#A88B7A]" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-[#3D3028] text-sm">Efficient Updates</h4>
                            <p className="text-[12px] text-gray-600 leading-relaxed font-medium">
                                Individual save buttons help reduce server load by only sending the specific data you modified. Changes take effect on the storefront instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
