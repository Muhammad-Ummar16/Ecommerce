import React, { useEffect } from 'react';
import { BrowserRouter, } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

import AppRoutes from './routes/AppRoutes';
import { SettingsProvider } from './context/SettingsContext';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('userInfo');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
