import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Search as SearchIcon } from 'lucide-react';
import NavBar from '../components/NavBar';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const SORT_OPTIONS = [
    { id: 'newest', label: 'Newest Arrivals' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
    { id: 'highest_rated', label: 'Highest Rated' }
];

const NewArrivalsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // Local state for debounced search
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

    // Extract filter state from URL
    const currentFilters = {
        search: searchParams.get('search') || '',
        size: searchParams.get('size') || '',
        sort: searchParams.get('sort') || 'newest',
        page: Number(searchParams.get('page')) || 1,
        limit: 10,
        isNewArrival: true // The key differentiator for this page
    };

    // Fetch products via TanStack Query mock hook
    const queryFilters = {
        ...currentFilters,
        sizes: currentFilters.size ? [currentFilters.size] : []
    };

    const { data: result, isLoading, isError, isFetching } = useProducts(queryFilters);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilter('search', searchInput || null);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // General URL updater function
    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (key !== 'page') newParams.delete('page');

        if (!value || value === 'all') {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }

        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
        setSearchInput('');
    };

    return (
        <div className="bg-[#f8f5f2] min-h-screen pb-20 font-sans">
            <NavBar />

            {/* 1. Page Header Section */}
            <div className="pt-32 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <nav className="text-xs text-gray-500 mb-2 font-medium tracking-wider justify-center flex">
                    <a href="/" className="hover:text-[#7A5C4A]">Home</a> <span className="mx-2">/</span> <span className="text-gray-900">New Arrivals</span>
                </nav>
                <h1 className="text-4xl md:text-5xl font-black text-[#3D3028] uppercase tracking-tighter">New Arrivals</h1>
                {!isLoading && result && (
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                        Showing {result.totalCount} products
                    </p>
                )}
            </div>

            {/* 2. Top Filter Bar */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">

                    {/* Top Row: Search */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search new arrivals..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#7A5C4A] focus:bg-white transition-colors"
                            />
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Bottom Row: Sort & Size */}
                    <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 gap-4">
                        <div className="flex items-center gap-4">
                            {/* Size Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Size:</span>
                                <select
                                    value={currentFilters.size || 'all'}
                                    onChange={(e) => updateFilter('size', e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#3D3028] outline-none cursor-pointer focus:border-[#7A5C4A]"
                                >
                                    <option value="all">Any Size</option>
                                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Clear Filters (if active) */}
                            {(currentFilters.size || searchInput) && (
                                <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:underline">
                                    Clear Filters
                                </button>
                            )}

                            {/* Sort Dropdown */}
                            <div className="relative group flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase hidden sm:block">Sort:</span>
                                <select
                                    value={currentFilters.sort}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 px-4 py-1.5 pr-8 rounded-lg text-sm font-bold text-[#3D3028] outline-none cursor-pointer focus:border-[#7A5C4A]"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Product Grid Area */}
            <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Skeletons while loading/fetching */}
                {(isLoading || isFetching) && !result ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 aspect-[4/5] w-full mb-3 rounded-lg"></div>
                                <div className="h-3 bg-gray-200 w-3/4 mb-2 rounded"></div>
                                <div className="h-2 bg-gray-200 w-1/2 mb-2 rounded"></div>
                                <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : result?.data.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <SearchIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-[#3D3028] mb-2">No Products Found</h3>
                        <p className="text-gray-500 max-w-sm mb-6 text-sm">We couldn't find any products matching your selection.</p>
                        <button
                            onClick={clearFilters}
                            className="bg-[#3D3028] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#2c221c] transition-colors"
                        >
                            Clear Selection
                        </button>
                    </div>
                ) : (
                    /* Product List (Smaller Cards via cols-5) */
                    <>
                        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                            {result.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination System */}
                        {result.totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2 pt-6">
                                <button
                                    disabled={currentFilters.page === 1}
                                    onClick={() => updateFilter('page', currentFilters.page - 1)}
                                    className="px-3 py-1.5 text-xs font-bold text-gray-600 disabled:opacity-50 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                >
                                    Prev
                                </button>

                                {[...Array(result.totalPages)].map((_, idx) => {
                                    const pageNum = idx + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => updateFilter('page', pageNum)}
                                            className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${pageNum === currentFilters.page
                                                ? 'bg-[#3D3028] text-white shadow-sm'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#7A5C4A]'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}

                                <button
                                    disabled={currentFilters.page === result.totalPages}
                                    onClick={() => updateFilter('page', currentFilters.page + 1)}
                                    className="px-3 py-1.5 text-xs font-bold text-gray-600 disabled:opacity-50 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default NewArrivalsPage;
