import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

// Helper fetch function for multiple products
const fetchProducts = async ({ queryKey }) => {
    const [_key, filters] = queryKey;

    // Construct params from filters
    const params = {
        search: filters.search || '',
        isNewArrival: filters.isNewArrival || false,
        isBestSeller: filters.isBestSeller || false,
        category: filters.category || '',
        sort: filters.sort || 'newest',
        page: filters.page || 1,
        limit: filters.limit || 8,
    };

    if (filters.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
    }

    if (filters.sizes && filters.sizes.length > 0) {
        params.sizes = filters.sizes.join(',');
    }

    if (filters.colors && filters.colors.length > 0) {
        params.colors = filters.colors.join(',');
    }

    if (filters.minRating) {
        params.minRating = filters.minRating;
    }

    const { data } = await axios.get(API_URL, { params });
    return data;
};

export const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: fetchProducts,
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};

// Helper fetch single product
const fetchProduct = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
};

export const useProduct = (id) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: fetchProduct,
        staleTime: 5 * 60 * 1000,
        enabled: !!id,
    });
};
