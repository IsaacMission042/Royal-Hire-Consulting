"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface AuthContextType {
    user: any;
    login: (email: string, accessCode: string) => Promise<{ success: boolean; msg?: string }>;
    adminLogin: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, accessCode: string) => {
        try {
            const res = await api.post('/auth/login', { email, accessCode });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            router.push(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
            return { success: true };
        } catch (err: any) {
            return { success: false, msg: err.response?.data?.msg || 'Login failed' };
        }
    };

    const adminLogin = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/admin-login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            router.push('/admin');
            return { success: true };
        } catch (err: any) {
            return { success: false, msg: err.response?.data?.msg || 'Invalid Admin Credentials' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
