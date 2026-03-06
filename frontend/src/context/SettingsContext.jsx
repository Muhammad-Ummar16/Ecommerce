import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        whatsappNumber: '+923000000000',
        siteName: 'MZ Wear'
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/settings`);
            setSettings(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateSettings = async (newSettings) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/settings`, newSettings, config);
            setSettings(data);
            return { success: true };
        } catch (error) {
            console.error('Failed to update settings:', error);
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings: fetchSettings }}>
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
