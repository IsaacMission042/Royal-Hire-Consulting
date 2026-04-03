"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Key, LogIn, ExternalLink, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useFormValidation, commonRules } from '@/lib/validation';
import { motion } from 'framer-motion';
import { Metadata } from 'next';

export default function Login() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const {
        data,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll
    } = useFormValidation(
        { email: '', password: '' },
        {
            email: commonRules.email,
            password: commonRules.password || commonRules.accessCode // Fallback if password rule not in validation.ts
        }
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (!validateAll()) {
            return;
        }

        setLoading(true);
        try {
            const res = await login(data.email, data.password);
            if (!res.success) {
                setServerError(res.msg || 'Login failed');
            }
        } catch (error) {
            setServerError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
            <Navbar />

            {/* Subtle Brand Background */}
            <div className="absolute top-0 right-0 w-1/2 h-screen bg-purple-50/30 -z-10 translate-x-20 rotate-12 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-[50%] bg-yellow-50/20 -z-10 -translate-x-10 translate-y-20 blur-3xl rounded-full" />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-10"
                    >
                        {/* Text-Based Logo Implementation */}
                        <div className="inline-block mb-10 relative group">
                            <div className="absolute -inset-4 bg-yellow-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative flex flex-col items-center">
                                <span className="text-5xl md:text-6xl font-black text-purple-700 tracking-tighter leading-none mb-1">
                                    ROYAL HIRE
                                </span>
                                <div className="flex items-center gap-3 w-full">
                                    <div className="h-[2px] flex-1 bg-yellow-400" />
                                    <span className="text-xs md:text-sm font-black text-slate-900 tracking-[0.4em] uppercase">
                                        CONSULTING
                                    </span>
                                    <div className="h-[2px] flex-1 bg-yellow-400" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-lg font-black text-slate-400 tracking-[0.2em] uppercase mt-4 mb-2">
                            Student Gateway
                        </h1>
                        <div className="h-1 w-12 bg-purple-700 mx-auto rounded-full" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border-t-4 border-purple-700 rounded-3xl p-10 shadow-2xl shadow-purple-500/5"
                    >
                        {serverError && (
                            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-lg text-xs font-black uppercase tracking-widest leading-relaxed flex items-center gap-2">
                                <AlertCircle size={16} />
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-8" noValidate>
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-black text-purple-700 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-purple-300 group-focus-within:text-purple-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        onBlur={() => handleBlur('email')}
                                        className={`w-full bg-slate-50 border rounded-2xl py-4 pl-14 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-700 focus:bg-white transition-all font-bold text-sm ${
                                            errors.email && touched.email ? 'border-red-300 bg-red-50' : 'border-slate-100'
                                        }`}
                                        placeholder="you@example.com"
                                        aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                                        aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                                    />
                                </div>
                                {errors.email && touched.email && (
                                    <p id="email-error" className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-[11px] font-black text-purple-700 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-purple-300 group-focus-within:text-purple-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        onBlur={() => handleBlur('password')}
                                        className={`w-full bg-slate-50 border rounded-2xl py-4 pl-14 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-700 focus:bg-white transition-all font-bold text-sm ${
                                            errors.password && touched.password ? 'border-red-300 bg-red-50' : 'border-slate-100'
                                        }`}
                                        placeholder="••••••••"
                                        aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                                        aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                                    />
                                </div>
                                {errors.password && touched.password && (
                                    <p id="password-error" className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                                <button
                                type="submit"
                                disabled={loading || Object.values(errors).some(e => e !== '')}
                                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.25em] shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ring-2 ring-transparent hover:ring-yellow-400/50"
                            >
                                {loading ? (
                                    <LoadingSpinner size="sm" message="" />
                                ) : (
                                    <>Enter Learning Center <LogIn size={18} className="text-yellow-400" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-slate-50 space-y-5 text-center">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                Missing an account?{' '}
                                <Link href="/register" className="text-purple-700 hover:text-purple-900 border-b-2 border-yellow-400/30 hover:border-yellow-400 transition-colors">
                                    Register Now
                                </Link>
                            </p>

                            <div className="flex items-center justify-center gap-2 text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">
                                <ShieldCheck size={12} className="text-yellow-400" />
                                End-to-End Encryption Enabled
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
