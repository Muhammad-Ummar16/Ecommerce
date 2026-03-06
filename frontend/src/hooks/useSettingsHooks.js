import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/settings`;

const fetchSettings = async () => {
    const { data } = await axios.get(API_URL);
    return data;
};

export const useSettingsQuery = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 30 * 60 * 1000, // 30 minutes
    });
};
