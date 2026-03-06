import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;

const fetchCategories = async () => {
    const { data } = await axios.get(API_URL);
    // Handle both {categories: []} and [] formats
    return data.categories || data || [];
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

const fetchCategory = async ({ queryKey }) => {
    const [_key, id] = queryKey;
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
};

export const useCategory = (id) => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: fetchCategory,
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
};
