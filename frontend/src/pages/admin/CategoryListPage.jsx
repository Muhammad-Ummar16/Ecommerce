import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Image as ImageIcon,
    X,
    Loader2,
    LayoutGrid,
    List as ListIcon,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { useCategories } from '../../hooks/useCategoryHooks';

const CategoryListPage = () => {
    const { data: categories = [], isLoading: loading, refetch } = useCategories();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                imageUrl: category.image?.url || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', imageUrl: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };

            const payload = {
                name: formData.name,
                description: formData.description,
                image: { url: formData.imageUrl }
            };

            if (editingCategory) {
                await axios.put(`${import.meta.env.VITE_API_URL}/categories/${editingCategory._id}`, payload, config);
                toast.success('Category updated successfully');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/categories`, payload, config);
                toast.success('Category created successfully');
            }

            refetch();
            handleCloseModal();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? Products associated with it will remain but without a category link.')) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, config);
            toast.success('Category deleted');
            refetch();
        } catch (err) {
            toast.error('Failed to delete category');
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#3D3028] uppercase tracking-tight">Collections & Categories</h1>
                    <p className="text-gray-500 font-medium text-sm">Organize your products into seasonal distributions.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#3D3028] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-[#3D3028]/10 group"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    New Category
                </button>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-gray-200 shadow-sm">
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3D3028] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-[#3D3028]/5 transition-all outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-[#3D3028] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-[#3D3028] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <ListIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#3D3028]" />
                    <p className="font-bold text-[#3D3028] uppercase tracking-widest text-[10px]">Syncing categories...</p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-[#3D3028] uppercase">No categories found</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-xs font-medium">Create your first category to start organizing your products efficiently.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((cat) => (
                        <div key={cat._id} className="group bg-white rounded-[32px] border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                            <div className="aspect-[16/10] relative bg-gray-50 overflow-hidden">
                                {cat.image?.url ? (
                                    <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleOpenModal(cat)}
                                        className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-[#3D3028] hover:bg-[#3D3028] hover:text-white transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-black text-[#3D3028] uppercase tracking-tight mb-2 truncate">{cat.name}</h3>
                                <p className="text-gray-400 text-xs font-medium truncate mb-4">{cat.description || 'No description provided'}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] bg-[#F4EBE6] px-3 py-1 rounded-full">Collection</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added {new Date(cat.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A]">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] hidden md:table-cell">Description</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] hidden sm:table-cell text-right">Created At</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCategories.map((cat) => (
                                <tr key={cat._id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                                {cat.image?.url ? <img src={cat.image.url} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 m-auto text-gray-300" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#3D3028] uppercase tracking-tight">{cat.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest md:hidden">{new Date(cat.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 hidden md:table-cell">
                                        <p className="text-sm text-gray-500 font-medium max-w-xs truncate">{cat.description || '-'}</p>
                                    </td>
                                    <td className="px-8 py-4 hidden sm:table-cell text-right">
                                        <p className="text-sm text-gray-900 font-bold">{new Date(cat.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(cat)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#3D3028] hover:bg-white rounded-xl shadow-sm transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(cat._id)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#3D3028]/40 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal} />
                    <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl animate-slide-up overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#3D3028] uppercase tracking-tight">
                                        {editingCategory ? 'Edit Category' : 'New Category'}
                                    </h2>
                                    <p className="text-xs text-gray-500 font-medium">Fill in the details for your collection.</p>
                                </div>
                                <button onClick={handleCloseModal} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-400 hover:text-[#3D3028] transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] ml-2">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Summer Collection"
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-[#3D3028] transition-all font-bold text-[#3D3028]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] ml-2">Description</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Tell us about this distribution..."
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-[#3D3028] transition-all font-bold text-[#3D3028] resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A5C4A] ml-2">Hero Image URL</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-[#3D3028] transition-all font-bold text-[#3D3028] text-xs"
                                            />
                                        </div>
                                        {formData.imageUrl && (
                                            <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                <img src={formData.imageUrl} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 bg-gray-50 text-gray-500 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] bg-[#3D3028] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black shadow-xl shadow-[#3D3028]/10 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                {editingCategory ? 'Update Collection' : 'Create Collection'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryListPage;
