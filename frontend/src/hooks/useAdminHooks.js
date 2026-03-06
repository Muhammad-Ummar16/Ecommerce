import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const fetchUsers = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
    };
    const { data } = await axios.get(`${API_URL}/admin/users`, config);
    return data;
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 5 * 60 * 1000,
    });
};

const fetchInquiries = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
    };
    const { data } = await axios.get(`${API_URL}/contacts`, config);
    return data;
};

export const useInquiries = () => {
    return useQuery({
        queryKey: ['inquiries'],
        queryFn: fetchInquiries,
        staleTime: 5 * 60 * 1000,
    });
};
