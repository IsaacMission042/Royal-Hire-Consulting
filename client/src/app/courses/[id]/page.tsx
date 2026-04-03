"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Lock, PlayCircle, FileText, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.error("Failed to fetch course", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!user) {
            router.push('/register');
            return;
        }
        setEnrolling(true);
        try {
            await api.post(`/courses/${id}/enroll`);
            // Refresh course data to update UI state
            const res = await api.get(`/courses/${id}`);
            setCourse(res.data);
        } catch (err: any) {
            alert(err.response?.data?.msg || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
    );

    if (!course) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p>Course not found</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4 text-purple-400 text-sm font-bold uppercase tracking-widest">
                            <span className="bg-purple-900/50 px-3 py-1 rounded-full border border-purple-500/30">{course.level}</span>
                            <span>•</span>
                            <span>{course.modules?.length || 0} Modules</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{course.title}</h1>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">{course.description}</p>

                        <div className="flex items-center gap-6">
                            {course.isEnrolled ? (
                                <button disabled className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 cursor-default">
                                    <CheckCircle size={20} /> Enrolled
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-900/50 flex items-center gap-2"
                                >
                                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                </button>
                            )}
                            <div className="text-2xl font-bold">
                                {course.price === 0 ? 'Free' : `$${course.price}`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Modules List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>

                        {course.modules?.map((mod: any, i: number) => (
                            <motion.div
                                key={mod._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`bg-white border rounded-2xl overflow-hidden transition-all ${mod.status === 'locked' ? 'border-gray-100 opacity-75' : 'border-purple-100 shadow-sm'}`}
                            >
                                <div className="p-6 flex items-start gap-4">
                                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${mod.status === 'locked' ? 'bg-gray-100 text-gray-400' : 'bg-purple-100 text-purple-700'}`}>
                                        {mod.status === 'locked' ? <Lock size={16} /> : <PlayCircle size={16} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
                                            Module {i + 1}: {mod.title}
                                            {mod.status !== 'locked' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Unlocked</span>}
                                        </h3>
                                        <p className="text-gray-500 mt-2 text-sm">{mod.description}</p>

                                        {/* Content Preview if unlocked */}
                                        {mod.status !== 'locked' && (
                                            <div className="mt-4 space-y-2">
                                                {mod.content?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer group">
                                                        {item.type === 'video' ? <PlayCircle size={18} className="text-purple-600" /> :
                                                            item.type === 'pdf' ? <FileText size={18} className="text-red-500" /> :
                                                                <Download size={18} className="text-blue-500" />}
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition">{item.title}</span>
                                                        <span className="ml-auto text-xs text-gray-400">{item.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Instructor</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold">
                                    {course.instructor?.name?.charAt(0) || 'R'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{course.instructor?.name || 'Royal Hire Expert'}</p>
                                    <p className="text-xs text-gray-500">Senior Consultant</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
