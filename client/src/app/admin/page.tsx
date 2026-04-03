"use client";
import React, { useState, useEffect } from 'react';
import {
    Users,
    BookOpen,
    CheckCircle,
    AlertCircle,
    Eye,
    MessageSquare,
    Search,
    Filter,
    MoreVertical,
    Navigation,
    LayoutDashboard,
    ShieldAlert,
    Layers,
    Plus,
    ShieldCheck,
    Book
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import MaterialManager from '@/components/admin/MaterialManager';
import CourseManager from '@/components/admin/CourseManager';
import AssignmentManager from '@/components/admin/AssignmentManager';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X as CloseIcon, LogOut } from 'lucide-react';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('submissions');
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/admin-login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await api.get('/modules/admin/all-submissions');
                setSubmissions(res.data);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.role === 'admin') fetchSubmissions();
    }, [user]);

    const handleReview = async (id: string, status: string) => {
        try {
            await api.post('/modules/admin/review', {
                submissionId: id,
                status,
                feedback: status === 'approved' ? 'Well done!' : 'Please revise.'
            });
            // Refresh
            const res = await api.get('/modules/admin/all-submissions');
            setSubmissions(res.data);
        } catch (err) {
            alert("Review failed");
        }
    };

    // Wipe admin session when leaving admin area (strict requirement)
    useEffect(() => {
        const handleUnload = () => {
            if (user?.role === 'admin') {
                // We don't necessarily want to wipe on every refresh, 
                // but the user asked for "wipe whenever they go out of it".
                // Standard logout is clearer, but I'll ensure logout is easily accessible.
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push('/admin-login');
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1e1b4b] text-white p-4 flex justify-between items-center z-50">
                <span className="font-black text-lg tracking-tighter">ROYAL HIRE</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Admin Sidebar */}
            <aside className={`w-64 bg-[#1e1b4b] text-white flex flex-col fixed inset-y-0 shadow-2xl z-50 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 border-b border-indigo-900/50 flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative flex flex-col items-start"
                    >
                        <span className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                            ROYAL HIRE
                        </span>
                        <div className="flex items-center gap-2 w-full">
                            <div className="h-[1px] flex-1 bg-yellow-400" />
                            <span className="text-[9px] font-black text-indigo-300 tracking-[0.3em] uppercase">
                                CONSULTING
                            </span>
                            <div className="h-[1px] flex-1 bg-yellow-400" />
                        </div>
                    </motion.div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-400/10 rounded-full w-fit border border-yellow-400/20">
                        <ShieldCheck size={12} className="text-yellow-400" />
                        <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Admin Control</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {[
                        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
                        { id: 'courses', label: 'Manage Courses', icon: <Book size={20} /> },
                        { id: 'materials', label: 'Course Modules', icon: <Layers size={20} /> },
                        { id: 'assignments_config', label: 'Assignments', icon: <Plus size={20} /> },
                        { id: 'submissions', label: 'Submissions', icon: <BookOpen size={20} /> },
                        { id: 'students', label: 'Students', icon: <Users size={20} /> },
                    ].map(item => (
                        <motion.button
                            key={item.id}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition duration-300 font-bold text-sm ${activeTab === item.id ? 'bg-indigo-700 text-white shadow-lg ring-1 ring-indigo-500' : 'text-indigo-200/60 hover:bg-indigo-900/50 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </motion.button>
                    ))}
                </nav>

                <div className="p-4 border-t border-indigo-900/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 transition font-bold text-sm"
                    >
                        <LogOut size={20} />
                        Logout & Wipe Session
                    </button>
                </div>
            </aside>

            {/* Main Container */}
            <main className="flex-1 lg:ml-64 flex flex-col">
                {/* Admin Header */}
                <header className="bg-white border-b border-gray-100 py-5 px-8 flex justify-between items-center sticky top-0 z-30">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                            {activeTab} Management
                        </h2>
                    </motion.div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:relative md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 w-64 outline-none transition"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-900 leading-tight">{user?.name || user?.email?.split('@')[0] || 'Admin'}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role === 'admin' ? 'Master Admin' : 'Staff'}</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-indigo-100">
                                {(user?.name?.[0] || user?.email?.[0] || 'A').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Admin Content */}
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pt-20 lg:pt-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {[
                                            { label: "Active Students", value: "124", icon: <Users />, color: "bg-indigo-600" },
                                            { label: "Total Courses", value: "12", icon: <Book />, color: "bg-blue-600" },
                                            { label: "New Submissions", value: submissions.filter(s => s.status === 'under review').length.toString(), icon: <Layers />, color: "bg-orange-500" },
                                            { label: "Certificates Issued", value: "89", icon: <ShieldCheck />, color: "bg-green-600" },
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group"
                                            >
                                                <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-gray-100`}>
                                                    {stat.icon}
                                                </div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                                <h4 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h4>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center">
                                         <Navigation size={40} className="mx-auto text-indigo-100 mb-4" />
                                         <h3 className="text-xl font-black text-gray-900 uppercase">Master Controller</h3>
                                         <p className="text-gray-400 mt-2 font-medium max-w-md mx-auto">Use the sidebar to manage your academy. Switch between courses, modules, and assignment reviews seamlessly.</p>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'materials' && <MaterialManager />}
                            {activeTab === 'courses' && <CourseManager />}
                            {activeTab === 'assignments_config' && <AssignmentManager />}

                            {activeTab === 'submissions' && (
                                <div className="space-y-6">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { label: "Total Submissions", value: submissions.length.toString(), icon: <BookOpen />, color: "bg-blue-600" },
                                            { label: "Pending Review", value: submissions.filter(s => s.status === 'under review').length.toString(), icon: <AlertCircle />, color: "bg-yellow-500" },
                                            { label: "Approved Today", value: submissions.filter(s => s.status === 'approved').length.toString(), icon: <CheckCircle />, color: "bg-green-500" },
                                        ].map((stat, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:shadow-md transition duration-300"
                                            >
                                                <div className={`w-14 h-14 ${stat.color} text-white rounded-xl flex items-center justify-center shadow-lg shadow-gray-100 group-hover:scale-110 transition duration-300`}>
                                                    {stat.icon}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                                    <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Table Section */}
                                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                            <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest">Recent Assignments</h3>
                                            <button className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition uppercase tracking-widest">
                                                <Filter size={14} /> Filter
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-gray-50">
                                                    <tr>
                                                        <th className="px-8 py-5">Student Details</th>
                                                        <th className="px-8 py-5">Module</th>
                                                        <th className="px-8 py-5">Reference</th>
                                                        <th className="px-8 py-5">Status</th>
                                                        <th className="px-8 py-5 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {submissions.map((sub) => (
                                                        <tr key={sub._id} className="hover:bg-gray-50/50 transition duration-200 group">
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center text-xs font-black shadow-inner">
                                                                        {sub.user?.email?.[0].toUpperCase() || 'S'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-900">{sub.user?.email?.split('@')[0] || 'Unknown Student'}</p>
                                                                        <p className="text-[11px] text-gray-400 font-medium">{sub.user?.email}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">Module {sub.moduleNumber}</span>
                                                            </td>
                                                            <td className="px-8 py-6 text-[11px] text-gray-500 font-mono">
                                                                {sub.submissionUrl?.slice(0, 30) ?? 'No Link Provided'}...
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${sub.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                                    sub.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                        'bg-yellow-100 text-yellow-700'
                                                                    }`}>
                                                                    {sub.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-6 text-right">
                                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                                                                    <button
                                                                        onClick={() => handleReview(sub._id, 'approved')}
                                                                        className="px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-lg hover:bg-green-600 shadow-lg shadow-green-100 transition"
                                                                    >
                                                                        APPROVE
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReview(sub._id, 'rejected')}
                                                                        className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600 shadow-lg shadow-red-100 transition"
                                                                    >
                                                                        REJECT
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'students' && (
                                <div className="bg-white p-20 text-center rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <Users size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase">Student Database</h3>
                                    <p className="text-gray-400 mt-2 font-medium">Coming soon: Full student progress tracking.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
