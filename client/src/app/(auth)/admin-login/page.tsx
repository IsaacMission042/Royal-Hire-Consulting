"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ShieldCheck,
  Lock,
  LogIn,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await adminLogin(email, password);
    if (!res.success) {
      setError(res.msg || "Invalid Administrative Credentials");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      <Navbar />

      {/* Elegant Background Elements */}
      <div className="absolute top-0 left-0 w-1/2 h-screen bg-purple-50/20 -z-10 -translate-x-20 -translate-y-20 blur-3xl rounded-full" />
      <div className="absolute top-0 right-0 w-1/3 h-[40%] bg-yellow-50/20 -z-10 translate-x-10 -translate-y-10 blur-3xl rounded-full" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-700 transition-colors mb-8 font-black text-[10px] uppercase tracking-[0.3em] group"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back to Home
            </Link>

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
              Admin Portal
            </h1>
            <div className="h-1 w-12 bg-purple-700 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-t-8 border-purple-900 rounded-[2.5rem] p-12 shadow-2xl shadow-purple-900/10 border-x border-b border-purple-50"
          >
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-8">
              <div className="space-y-2 group">
                <label className="text-[11px] font-black text-purple-900 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  Internal Identifier
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-purple-200 group-focus-within:text-purple-700 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-900 focus:bg-white transition-all font-bold text-sm"
                    placeholder="admin@royalhire.com"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[11px] font-black text-purple-900 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  Secure Passkey
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-purple-200 group-focus-within:text-purple-700 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-16 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-900 focus:bg-white transition-all font-bold text-sm"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-purple-200 hover:text-purple-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e1b4b] hover:bg-black text-white py-6 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-900/20 flex items-center justify-center gap-4 transition-all active:scale-[0.97] disabled:opacity-50 ring-2 ring-transparent hover:ring-yellow-400/50"
              >
                {loading ? (
                  "Initializing..."
                ) : (
                  <>
                    Access Admin Dashboard{" "}
                    <LogIn size={20} className="text-yellow-400" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-3 text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">
              <ShieldCheck size={14} className="text-yellow-500" />
              Nexus Secure Infrastructure
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
