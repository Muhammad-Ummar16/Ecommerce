import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Save,
    Trash2,
    Image as ImageIcon,
    Tag,
    Info,
    CheckCircle2
} from 'lucide-react';

const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        stock: '',
        images: [],
        colors: [],
        sizes: [],
        isNewArrival: false,
        isBestSeller: false
    });

    const [newColor, setNewColor] = useState('');
    const [newSize, setNewSize] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: catData } = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
                setCategories(catData);

                if (isEdit) {
                    const { data: prodData } = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
                    setFormData({
                        ...prodData,
                        category: prodData.category?._id || ''
                    });
                }
            } catch (err) {
                toast.error('Failed to fetch data');
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const addItem = (type, value) => {
        if (!value.trim()) return;
        if (formData[type].includes(value)) {
            toast.error(`${value} already added`);
            return;
        }
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], value]
        }));
        if (type === 'colors') setNewColor('');
        if (type === 'sizes') setNewSize('');
    };

    const addImage = () => {
        if (!newImageUrl.trim()) return;
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url: newImageUrl }]
        }));
        setNewImageUrl('');
    };

    const removeItem = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Manual Validation
            if (!formData.category) {
                toast.error('Please select a category');
                setLoading(false);
                return;
            }

            if (formData.images.length === 0) {
                toast.error('Please add at least one product image');
                setLoading(false);
                return;
            }

            if (Number(formData.price) <= 0) {
                toast.error('Price must be greater than 0');
                setLoading(false);
                return;
            }

            if (Number(formData.stock) < 0) {
                toast.error('Stock cannot be negative');
                setLoading(false);
                return;
            }

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };

            if (isEdit) {
                await axios.put(`${import.meta.env.VITE_API_URL}/products/${id}`, formData, config);
                toast.success('Product updated successfully');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/products`, formData, config);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D3028]"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#3D3028] hover:shadow-md transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight">
                            {isEdit ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">Fill in the details to publish your product.</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs text-[#7A5C4A] hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#3D3028] text-white px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#2c221c] transition-all shadow-lg shadow-[#3D3028]/10 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-[#A88B7A] rounded-full"></div>
                            <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Basic Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-[#7A5C4A] mb-2 ml-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Classic Oversized Hoodie"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-[#7A5C4A] mb-2 ml-1">Short Description</label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    placeholder="Key highlight (e.g. 100% Premium Cotton)"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-[#7A5C4A] mb-2 ml-1">Full Description</label>
                                <textarea
                                    name="description"
                                    rows="5"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Tell the story behind this piece..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Media Management */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-[#E3CBC1] rounded-full"></div>
                            <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Product Images</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Paste image URL here..."
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={addImage}
                                    className="px-6 py-4 bg-[#F4EBE6] text-[#3D3028] rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#EBDDD5] transition-all"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative aspect-square rounded-2xl border border-gray-100 overflow-hidden group shadow-sm bg-gray-50">
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeItem('images', index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-xl scale-0 group-hover:scale-100 transition-all shadow-lg shadow-red-500/20"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                {formData.images.length < 6 && (
                                    <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 group hover:border-[#3D3028] hover:text-[#3D3028] transition-all cursor-pointer">
                                        <ImageIcon className="w-6 h-6 group-hover:animate-bounce" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Image Slot</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-[#3D3028] rounded-full"></div>
                            <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Variants</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Colors */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-widest text-[#7A5C4A] ml-1">Available Colors</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        placeholder="Add color (e.g. Black)"
                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3D3028]/5 transition-all text-center"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('colors', newColor))}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addItem('colors', newColor)}
                                        className="p-3.5 bg-white border border-gray-100 rounded-2xl text-[#3D3028] hover:bg-gray-50 transition-all font-bold"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[44px]">
                                    {formData.colors.map((color, i) => (
                                        <div key={i} className="flex items-center gap-2 pl-4 pr-2 py-1.5 bg-[#F4EBE6] text-[#3D3028] rounded-xl text-xs font-bold shadow-sm">
                                            {color}
                                            <button type="button" onClick={() => removeItem('colors', i)} className="p-1 hover:text-red-500 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black uppercase tracking-widest text-[#7A5C4A] ml-1">Available Sizes</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="Add size (e.g. XL)"
                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3D3028]/5 transition-all text-center uppercase"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('sizes', newSize))}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addItem('sizes', newSize)}
                                        className="p-3.5 bg-white border border-gray-100 rounded-2xl text-[#3D3028] hover:bg-gray-50 transition-all font-bold"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[44px]">
                                    {formData.sizes.map((size, i) => (
                                        <div key={i} className="flex items-center gap-2 pl-4 pr-2 py-1.5 bg-[#3D3028] text-[#E3CBC1] rounded-xl text-xs font-black uppercase shadow-sm">
                                            {size}
                                            <button type="button" onClick={() => removeItem('sizes', i)} className="p-1 hover:text-red-400 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Pricing */}
                <div className="space-y-8">
                    {/* Organization */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-[#A88B7A] rounded-full"></div>
                            <h2 className="text-xl font-black text-[#3D3028] uppercase tracking-tight">Organization</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all appearance-none cursor-pointer font-bold text-[#3D3028]"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="flex items-center gap-4 cursor-pointer group p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                                    <input
                                        type="checkbox"
                                        name="isNewArrival"
                                        checked={formData.isNewArrival}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 rounded-lg border-2 border-gray-200 text-[#3D3028] focus:ring-0"
                                    />
                                    <span className="text-sm font-bold text-[#3D3028] uppercase tracking-wide">New Arrival</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                                    <input
                                        type="checkbox"
                                        name="isBestSeller"
                                        checked={formData.isBestSeller}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 rounded-lg border-2 border-gray-200 text-[#3D3028] focus:ring-0"
                                    />
                                    <span className="text-sm font-bold text-[#3D3028] uppercase tracking-wide">Best Seller</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="bg-[#3D3028] p-8 rounded-[32px] text-white shadow-xl shadow-[#3D3028]/20 space-y-6">
                        <div className="flex items-center gap-3 mb-2 text-[#E3CBC1]">
                            <Tag className="w-5 h-5" />
                            <h2 className="text-xl font-black uppercase tracking-tight">Pricing & Stock</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#E3CBC1]/60 mb-2 ml-1">Base Price (RS)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#E3CBC1]/20 focus:bg-white/10 transition-all text-white font-bold"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#E3CBC1]/60 mb-2 ml-1">Discounted Price (Optional)</label>
                                <input
                                    type="number"
                                    name="discountPrice"
                                    value={formData.discountPrice}
                                    onChange={handleInputChange}
                                    placeholder="Lower than base price"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#E3CBC1]/20 focus:bg-white/10 transition-all text-white font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#E3CBC1]/60 mb-2 ml-1">Inventory Quantity</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#E3CBC1]/20 focus:bg-white/10 transition-all text-white font-bold text-center text-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <Info className="w-4 h-4 text-[#E3CBC1] mt-0.5" />
                                <p className="text-[10px] text-[#E3CBC1]/80 leading-relaxed font-medium capitalize">
                                    Prices shown on frontend will automatically prioritize the discounted price if provided.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar Mobile */}
                    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm md:hidden sticky bottom-6 z-20 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#3D3028] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#2c221c] transition-all shadow-lg"
                        >
                            {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Product</>}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="w-full text-xs font-bold uppercase tracking-widest text-gray-400 py-2 hover:text-[#3D3028]"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
