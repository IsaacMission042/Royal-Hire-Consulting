"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Book, Layers } from 'lucide-react';
import api from '@/lib/api';

export default function CourseManager() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'Beginner', // Beginner, Intermediate, Advanced
        thumbnail: '',
        price: 0,
        category: 'General',
        googleMeetLink: ''
    });

    useEffect(() => {
        fetchCourses();
    }, []);

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

    const handleSave = async () => {
        try {
            if (editingId) {
                const res = await api.put(`/courses/${editingId}`, formData);
                setCourses(courses.map(c => c._id === editingId ? res.data : c));
            } else {
                const res = await api.post('/courses', formData);
                setCourses([...courses, res.data]);
            }
            setIsAdding(false);
            setEditingId(null);
            resetForm();
        } catch (err: any) {
            console.error("Failed to save course", err);
            alert(`Failed to save course: ${err.response?.data?.msg || err.message}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the course and may affect enrolled students.")) return;
        try {
            await api.delete(`/courses/${id}`);
            setCourses(courses.filter(c => c._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            level: 'Beginner',
            thumbnail: '',
            price: 0,
            category: 'General',
            googleMeetLink: ''
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Course Offerings</h3>
                <button
                    onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
                >
                    <Plus size={20} /> Add New Course
                </button>
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest">{editingId ? 'Edit Course' : 'New Course'}</h4>
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Course Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Professional Business Analysis"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Level</label>
                            <select
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Business, Tech, Design"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Thumbnail URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                />
                                {formData.thumbnail && (
                                    <div className="w-16 h-14 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                placeholder="What will students learn?"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] font-medium"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-indigo-600">Google Meet Live Session URL (Optional)</label>
                            <input
                                type="text"
                                placeholder="https://meet.google.com/..."
                                className="w-full bg-indigo-50 p-4 rounded-xl border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-indigo-700"
                                value={formData.googleMeetLink}
                                onChange={(e) => setFormData({ ...formData, googleMeetLink: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2 font-black text-gray-400 uppercase text-xs tracking-widest">Discard</button>
                        <button
                            onClick={handleSave}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100"
                        >
                            {editingId ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course._id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden group hover:shadow-xl transition duration-300 flex flex-col">
                        <div className="h-40 bg-gray-200 relative">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                {course.level}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">{course.title}</h4>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">{course.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="text-xs font-bold text-gray-400 uppercase">{course.modules?.length || 0} Modules</div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!confirm(`Generate Modules 1-8 for ${course.title}?`)) return;
                                            try {
                                                await api.post(`/modules/init/${course._id}`);
                                                alert("Modules generated successfully!");
                                                fetchCourses();
                                            } catch (err: any) {
                                                alert(err.response?.data?.msg || "Failed to generate modules");
                                            }
                                        }}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                                        title="Initialize Modules 1-8"
                                    >
                                        <Layers size={16} />
                                    </button>
                                    <button
                                        onClick={() => { setEditingId(course._id); setFormData({ ...course }); setIsAdding(false); }}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
