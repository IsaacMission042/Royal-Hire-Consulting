"use client";
import React, { useState, useEffect } from 'react';
import {
    Play,
    FileText,
    Download,
    CheckCircle,
    ArrowLeft,
    Send,
    ExternalLink,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function ModulePlayer() {
    const { id } = useParams();
    const router = useRouter();
    const [module, setModule] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState(0);
    const [assignment, setAssignment] = useState<any>(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const res = await api.get(`/modules/${id}`);
                setModule(res.data);
                const assRes = await api.get(`/modules/assignments/${id}`);
                setAssignment(assRes.data);
            } catch (err) {
                console.error("Error fetching module", err);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchModule();
    }, [id]);

    const handleSubmit = async () => {
        if (!submissionUrl) return alert("Please provide your submission");
        try {
            await api.post('/modules/submit', {
                moduleNumber: Number(id),
                assignmentId: assignment?._id,
                submissionUrl
            });
            setAssignmentSubmitted(true);
        } catch (err) {
            alert("Submission failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#1e1b4b] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    if (!module) return null;

    const lessons = module.content || [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Module Header */}
            <motion.header
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="bg-[#1e1b4b] text-white py-4 px-8 flex items-center justify-between sticky top-0 z-50 shadow-lg"
            >
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Module {id}</p>
                        <h1 className="text-lg font-black uppercase tracking-tight">{module.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 mr-4 border-r border-indigo-800 pr-6 hidden md:flex">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 shadow-inner">
                            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-tighter">Royal Hire</span>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-xs text-indigo-300 text-right font-bold uppercase tracking-widest">Progress</p>
                        <div className="w-32 h-2 bg-indigo-900 rounded-full mt-1 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "25%" }}
                                className="h-full bg-yellow-400"
                            ></motion.div>
                        </div>
                    </div>
                    <button className="px-5 py-2 bg-yellow-400 text-indigo-950 font-black rounded-lg text-sm hover:bg-yellow-500 transition shadow-lg active:scale-95">
                        DONE
                    </button>
                </div>
            </motion.header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Lesson Player Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    {/* Video Player */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-video bg-black rounded-[2.5rem] relative overflow-hidden shadow-2xl group border-8 border-white"
                    >
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-24 h-24 bg-yellow-400 text-indigo-950 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(250,204,21,0.3)]"
                            >
                                <Play size={40} fill="currentColor" />
                            </motion.div>
                        </div>
                        {/* Control Bar Mockup */}
                        <div className="absolute bottom-10 left-10 right-10 flex items-center gap-6 bg-black/20 backdrop-blur-xl p-6 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 border border-white/10">
                            <Play size={20} className="text-white fill-white" />
                            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "40%" }}
                                    className="h-full bg-yellow-400"
                                ></motion.div>
                            </div>
                            <span className="text-xs font-black text-white tracking-widest">04:20 / {lessons[activeLesson]?.duration || '15:00'}</span>
                        </div>
                    </motion.div>

                    {/* Lesson Info */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeLesson}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight">{lessons[activeLesson].title}</h2>
                                    <div className="flex items-center gap-6 mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg"><Play size={14} className="text-purple-600" /> {lessons[activeLesson].duration || '15 min'}</span>
                                        <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg"><CheckCircle size={14} className="text-green-500" /> Lesson {activeLesson + 1} of {lessons.length}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                                        className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition text-gray-400 hover:text-gray-900 border border-gray-100 active:scale-95"
                                    ><ChevronLeft /></button>
                                    <button
                                        onClick={() => setActiveLesson(Math.min(lessons.length - 1, activeLesson + 1))}
                                        className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition text-gray-400 hover:text-gray-900 border border-gray-100 active:scale-95"
                                    ><ChevronRight /></button>
                                </div>
                            </div>

                            <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed font-medium">
                                <p>In this lesson, we dive deep into the core philosophy of Royal Hire Consulting. You will learn the importance of structured problem solving and how our frameworks apply across different industries.</p>
                                <div className="mt-8 p-6 bg-purple-50 rounded-2xl border-l-4 border-purple-500">
                                    <h4 className="text-purple-900 font-black uppercase text-xs tracking-widest mb-4">Key Takeaways:</h4>
                                    <ul className="space-y-3">
                                        {['Professional ethics in the Nigerian workspace', 'Strategic alignment with corporate goals', 'Standard Operating Procedures (SOPs)'].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-purple-800">
                                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Assignment Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 rounded-[2.5rem] shadow-sm border-2 border-dashed border-purple-100 space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <FileText size={120} />
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center shadow-inner">
                                <FileText size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{assignment?.title || `Module ${id} Assignment`}</h3>
                        </div>

                        <div className="p-8 bg-purple-50/50 rounded-3xl border border-purple-100 relative z-10">
                            <p className="font-black text-purple-900 uppercase text-xs tracking-widest mb-4">Assignment Instructions:</p>
                            <p className="text-gray-700 font-medium italic leading-relaxed">"{assignment?.instructions || "No specific instructions provided. Please submit your work below."}"</p>

                            {assignment?.resources && assignment.resources.length > 0 && (
                                <div className="mt-8 flex flex-wrap gap-4">
                                    {assignment.resources.map((res: any, i: number) => (
                                        <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 bg-white border border-purple-100 text-purple-700 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-purple-100 transition shadow-sm">
                                            <Download size={16} /> {res.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!assignmentSubmitted ? (
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                                        {assignment?.submissionType === 'link' ? 'Google Docs / External Link' :
                                            assignment?.submissionType === 'text' ? 'Paste your answer below' : 'Your Submission'}
                                    </label>
                                    {assignment?.submissionType === 'text' ? (
                                        <textarea
                                            className="w-full bg-gray-50 p-6 rounded-3xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px] font-medium transition shadow-inner"
                                            placeholder="Type your answer here..."
                                            value={submissionUrl}
                                            onChange={(e) => setSubmissionUrl(e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold transition shadow-inner"
                                            placeholder={assignment?.submissionType === 'link' ? "https://docs.google.com/..." : "Enter submission link"}
                                            value={submissionUrl}
                                            onChange={(e) => setSubmissionUrl(e.target.value)}
                                        />
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="w-full py-6 bg-indigo-950 text-white font-black rounded-3xl hover:bg-black transition flex items-center justify-center gap-4 shadow-2xl uppercase tracking-widest text-sm"
                                >
                                    Submit Assignment <Send size={20} />
                                </motion.button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-12 bg-green-50 rounded-[2.5rem] border border-green-100 text-center relative z-10"
                            >
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <CheckCircle size={40} />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Assignment Submitted!</h4>
                                <p className="text-gray-500 mt-4 leading-relaxed font-medium">Your submission is currently <span className="text-purple-700 font-black italic">Under Review</span>. You will be notified once the admin approves it to unlock the next module.</p>
                                <div className="mt-8 inline-block px-8 py-3 bg-white rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-green-100 shadow-sm">
                                    Status: UNDER REVIEW
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar Lesson List */}
                <aside className="w-full lg:w-[400px] bg-white border-l border-gray-100 flex flex-col sticky top-[80px] h-[calc(100vh-80px)]">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                        <h3 className="font-black text-gray-900 uppercase tracking-widest flex items-center gap-3 text-sm">
                            Curriculum <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px]">{lessons.length} Lessons</span>
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                        {lessons.map((lesson: any, i: number) => (
                            <motion.button
                                key={i}
                                whileHover={{ x: 5 }}
                                onClick={() => setActiveLesson(i)}
                                className={`w-full p-5 text-left rounded-2xl transition-all duration-300 flex items-start gap-4 border ${activeLesson === i ? 'bg-purple-700 text-white shadow-xl border-purple-600' : 'hover:bg-gray-50 border-transparent text-gray-500'}`}
                            >
                                <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${activeLesson === i ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {lesson.type === 'video' ? <Play size={14} fill={activeLesson === i ? 'currentColor' : 'none'} /> : <FileText size={14} />}
                                </div>
                                <div className="flex-1">
                                    <h5 className={`text-sm font-black uppercase tracking-tight leading-tight ${activeLesson === i ? 'text-white' : 'text-gray-900'}`}>{lesson.title}</h5>
                                    <p className={`text-[9px] font-black uppercase mt-2 tracking-widest ${activeLesson === i ? 'text-white/60' : 'text-gray-400'}`}>{lesson.type} • {lesson.duration || '15:00'}</p>
                                </div>
                                {i === 0 && <CheckCircle size={18} className={`ml-auto ${activeLesson === i ? 'text-white' : 'text-green-500'}`} />}
                            </motion.button>
                        ))}
                    </div>

                    <div className="p-8 bg-gray-50 border-t border-gray-100">
                        <div className="p-6 bg-white rounded-4xl border border-gray-200 shadow-sm relative overflow-hidden group cursor-pointer hover:border-purple-300 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <ExternalLink size={40} />
                            </div>
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Help & Community</p>
                            <p className="text-sm font-bold text-gray-900 leading-snug">Need help? Connect with fellow consultants.</p>
                            <button className="mt-4 text-[10px] font-black text-purple-700 hover:text-purple-900 uppercase tracking-[0.2em] flex items-center gap-2">COMMUNITY PORTAL <ChevronRight size={12} /></button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
