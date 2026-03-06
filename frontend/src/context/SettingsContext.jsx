import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSettingsQuery } from '../hooks/useSettingsHooks';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const { data: settings = { whatsappNumber: '+923000000000', siteName: 'MZ Wear', siteUrl: 'https://mzwear.pk' }, isLoading: loading, refetch } = useSettingsQuery();

    const updateSettings = async (newSettings) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/settings`, newSettings, config);
            refetch();
            return { success: true };
        } catch (error) {
            console.error('Failed to update settings:', error);
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: refetch }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
