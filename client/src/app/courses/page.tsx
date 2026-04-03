"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, ArrowRight } from 'lucide-react';

interface Course {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: {
        name: string;
    };
    level: string;
    price: number;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-purple-900 py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                    >
                        Our Programs
                    </motion.h1>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                        Expert-led courses designed to fast-track your career in consulting and professional services.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-700">No courses available at the moment.</h3>
                        <p className="text-gray-500 mt-2">Check back soon for upcoming programs.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, i) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="h-48 bg-gray-200 relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-300">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-purple-700 uppercase tracking-widest shadow-sm">
                                        {course.level}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{course.description}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} />
                                                <span>{course.instructor?.name || 'Royal Hire Team'}</span>
                                            </div>
                                            <span className="font-bold text-lg text-purple-700">
                                                {course.price === 0 ? 'Free' : `$${course.price}`}
                                            </span>
                                        </div>
                                        <Link href={`/courses/${course._id}`} className="block w-full py-3 text-center bg-gray-900 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">
                                            View Program
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
