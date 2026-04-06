import axios, { AxiosError, AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? '/api' : 'http://localhost:5000/api'),
    timeout: 5000, // 5 second timeout (reduced from 10)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        if (error.response?.status === 403) {
            // Forbidden
            console.error('Access forbidden');
        }

        if (error.response && error.response.status >= 500) {
            // Server error
            console.error('Server error:', error.response.data);
        }

        if (error.code === 'ECONNABORTED') {
            // Timeout
            console.error('Request timeout');
        }

        if (!error.response) {
            // Network error
            console.error('Network error - please check your connection');
        }

        return Promise.reject(error);
    }
);

// Helper functions for common API patterns
export const apiHelpers = {
    handleApiError: (error: any): string => {
        if (error.response?.data?.msg) {
            return error.response.data.msg;
        }
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.message) {
            return error.message;
        }
        return 'An unexpected error occurred';
    },

    isNetworkError: (error: any): boolean => {
        return !error.response && error.code !== 'ECONNABORTED';
    },

    isTimeoutError: (error: any): boolean => {
        return error.code === 'ECONNABORTED';
    },

    retry: async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0 && apiHelpers.isNetworkError(error)) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return apiHelpers.retry(fn, retries - 1, delay * 2);
            }
            throw error;
        }
    }
};

export default api;
