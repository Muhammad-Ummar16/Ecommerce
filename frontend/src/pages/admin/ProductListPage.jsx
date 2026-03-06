import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Package,
    AlertCircle,
    Download
} from 'lucide-react';
import { exportToExcel, formatProductData } from '../../utils/ExcelExport';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
                params: {
                    search: searchTerm,
                    page: page,
                    limit: 10
                }
            });
            // New structure: { data: [...], page, pages, totalCount }
            setProducts(data.data || []);
            setPages(data.pages || 1);
            setTotalCount(data.totalCount || 0);
        } catch (err) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(1); // Reset to first page on new search
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Fetch when page changes
    useEffect(() => {
        fetchProducts();
    }, [page]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            setDeletingId(id);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, config);
            toast.success('Product deleted successfully');
            fetchProducts(); // Refresh list to get updated counts/pagination
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const handleExport = async () => {
        try {
            setExportLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/products`, {
                params: { limit: 1000 } // Fetch all products
            });
            const formatted = formatProductData(data.data || []);
            exportToExcel(formatted, 'Products_Report', 'Products', [
                { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 15 }
            ]);
            toast.success('Product report downloaded');
        } catch (err) {
            toast.error('Failed to export products');
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#3D3028] uppercase tracking-tight">Products</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your storefront items and stock.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={exportLoading}
                        className="flex items-center gap-2 bg-white border border-gray-100 text-[#3D3028] px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        {exportLoading ? (
                            <div className="w-4 h-4 border-2 border-[#3D3028] border-t-transparent animate-spin rounded-full" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Export Excel
                    </button>
                    <Link
                        to="/admin/products/add"
                        className="flex items-center gap-2 bg-[#3D3028] text-white px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#2c221c] transition-all shadow-lg shadow-[#3D3028]/10 group"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" /> Add New Product
                    </Link>
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#3D3028] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#3D3028]/5 focus:border-[#3D3028] transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FDFBF9]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Product</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Price</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Stock</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[#7A5C4A] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && products.length === 0 ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6" colSpan="6">
                                            <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#3D3028] line-clamp-1">{product.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">ID: {product._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-[#F4EBE6] text-[#3D3028] rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-[#3D3028]">
                                                {product.discountPrice ? (
                                                    <span className="flex flex-col">
                                                        <span>RS {product.discountPrice}</span>
                                                        <span className="text-[10px] text-gray-400 line-through">RS {product.price}</span>
                                                    </span>
                                                ) : (
                                                    `RS ${product.price}`
                                                )}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                                <span className="font-bold text-sm text-[#3D3028]">{product.stock} Units</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`
                                                px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                                                ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                                            `}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="p-2 text-gray-400 hover:text-[#3D3028] hover:bg-gray-100 rounded-xl transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    disabled={deletingId === product._id}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <Package className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#3D3028]">No products found</p>
                                                <p className="text-sm text-gray-400">Try adjusting your search or add a new product.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination System */}
                <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center sm:text-left">
                        Showing {products.length} of {totalCount} Products
                    </p>
                    {pages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                                className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-[#3D3028] hover:bg-gray-50 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {[...Array(pages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${page === i + 1
                                        ? 'bg-[#3D3028] text-white shadow-lg shadow-[#3D3028]/20'
                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-[#3D3028] hover:text-[#3D3028]'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                                disabled={page === pages}
                                className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-[#3D3028] hover:bg-gray-50 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
