"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Video, FileText, Link as LinkIcon, Book } from 'lucide-react';
import api from '@/lib/api';

export default function MaterialManager() {
    const [modules, setModules] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newModule, setNewModule] = useState({
        title: '',
        moduleNumber: '',
        description: '',
        courseId: '',
        content: [] as any[]
    });
    const [lessonInput, setLessonInput] = useState({ type: 'video', title: '', url: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [modRes, courseRes] = await Promise.all([
                api.get('/modules'),
                api.get('/courses')
            ]);
            setModules(modRes.data);
            setCourses(courseRes.data);
            if (courseRes.data.length > 0) {
                // Default new module to first course
                setNewModule(prev => ({ ...prev, courseId: courseRes.data[0]._id }));
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (isEdit: boolean) => {
        try {
            const data = isEdit ? editFormData : newModule;
            // Ensure courseId is set
            if (!data.courseId && courses.length > 0) {
                data.courseId = courses[0]._id;
            }

            const res = isEdit
                ? await api.put(`/modules/${editingId}`, { ...data, moduleNumber: parseInt(data.moduleNumber) })
                : await api.post('/modules', { ...data, moduleNumber: parseInt(data.moduleNumber) });

            if (isEdit) {
                setModules(modules.map(m => m._id === res.data._id ? res.data : m));
                setEditingId(null);
            } else {
                setModules([...modules, res.data]);
                setIsAdding(false);
                setNewModule({
                    title: '',
                    moduleNumber: '',
                    description: '',
                    courseId: courses.length > 0 ? courses[0]._id : '',
                    content: []
                });
            }
        } catch (err) {
            alert("Failed to save module. Make sure a Course is selected.");
            console.error(err);
        }
    };

    const handleDeleteModule = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/modules/${id}`);
            setModules(modules.filter(m => m._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const addLesson = (isEdit: boolean) => {
        if (!lessonInput.title || !lessonInput.url) return;
        if (isEdit) {
            setEditFormData({ ...editFormData, content: [...editFormData.content, lessonInput] });
        } else {
            setNewModule({ ...newModule, content: [...newModule.content, lessonInput] });
        }
        setLessonInput({ type: 'video', title: '', url: '' });
    };

    const removeLesson = (isEdit: boolean, idx: number) => {
        if (isEdit) {
            setEditFormData({ ...editFormData, content: editFormData.content.filter((_: any, i: number) => i !== idx) });
        } else {
            setNewModule({ ...newModule, content: newModule.content.filter((_, i) => i !== idx) });
        }
    };

    const filteredModules = selectedCourse === 'all'
        ? modules
        : modules.filter(m => m.courseId === selectedCourse);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Curriculum Manager</h3>

                <div className="flex gap-4">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select
                            className="bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wide py-3 pl-4 pr-10 rounded-xl outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="all">All Courses</option>
                            {courses.map(c => (
                                <option key={c._id} value={c._id}>{c.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Book size={14} />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
                    >
                        <Plus size={20} /> Create Module
                    </button>
                </div>
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest">{editingId ? 'Edit Module' : 'New Learning Module'}</h4>
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Course Selection for New/Edit Module */}
                        <div className="md:col-span-4">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assign to Course</label>
                            <select
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={editingId ? (editFormData.courseId || (courses.length > 0 ? courses[0]._id : '')) : newModule.courseId}
                                onChange={(e) => editingId ? setEditFormData({ ...editFormData, courseId: e.target.value }) : setNewModule({ ...newModule, courseId: e.target.value })}
                            >
                                <option value="" disabled>Select a Course</option>
                                {courses.map(c => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Module Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Advanced Market Analysis"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={editingId ? editFormData.title : newModule.title}
                                onChange={(e) => editingId ? setEditFormData({ ...editFormData, title: e.target.value }) : setNewModule({ ...newModule, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order #</label>
                            <input
                                type="number"
                                placeholder="1"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={editingId ? editFormData.moduleNumber : newModule.moduleNumber}
                                onChange={(e) => editingId ? setEditFormData({ ...editFormData, moduleNumber: e.target.value }) : setNewModule({ ...newModule, moduleNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Duration</label>
                            <input
                                type="text"
                                placeholder="2h 30m"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={editingId ? (editFormData.duration || '') : (newModule as any).duration || ''}
                                onChange={(e) => editingId ? setEditFormData({ ...editFormData, duration: e.target.value }) : setNewModule({ ...newModule, duration: e.target.value } as any)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            placeholder="Briefly describe what students will learn..."
                            className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] font-medium"
                            value={editingId ? editFormData.description : newModule.description}
                            onChange={(e) => editingId ? setEditFormData({ ...editFormData, description: e.target.value }) : setNewModule({ ...newModule, description: e.target.value })}
                        />
                    </div>

                    {/* Lessons Builder */}
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Lessons & Content</label>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-2xl">
                            <div>
                                <label className="text-[9px] font-bold text-gray-400">Type</label>
                                <select
                                    className="w-full bg-white p-2 rounded-lg border border-gray-200 outline-none text-xs font-bold"
                                    value={lessonInput.type}
                                    onChange={(e) => setLessonInput({ ...lessonInput, type: e.target.value })}
                                >
                                    <option value="video">Video</option>
                                    <option value="pdf">PDF</option>
                                    <option value="resource">Resource</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[9px] font-bold text-gray-400">Lesson Title</label>
                                <input
                                    type="text"
                                    placeholder="Lesson title..."
                                    className="w-full bg-white p-2 rounded-lg border border-gray-200 outline-none text-xs font-bold"
                                    value={lessonInput.title}
                                    onChange={(e) => setLessonInput({ ...lessonInput, title: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[9px] font-bold text-gray-400">URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="w-full bg-white p-2 rounded-lg border border-gray-200 outline-none text-xs font-bold"
                                        value={lessonInput.url}
                                        onChange={(e) => setLessonInput({ ...lessonInput, url: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => addLesson(!!editingId)}
                                    className="bg-indigo-600 text-white p-2 rounded-lg"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {(editingId ? editFormData.content : newModule.content).map((lesson: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {lesson.type === 'video' ? <Video size={16} className="text-blue-500" /> : <FileText size={16} className="text-red-500" />}
                                        <span className="text-sm font-bold text-gray-700">{lesson.title}</span>
                                    </div>
                                    <button onClick={() => removeLesson(!!editingId, idx)} className="text-gray-300 hover:text-red-500 transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2 font-black text-gray-400 uppercase text-xs tracking-widest">Discard</button>
                        <button
                            onClick={() => handleSave(!!editingId)}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100"
                        >
                            {editingId ? 'Update Module' : 'Publish Module'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {filteredModules.sort((a, b) => a.moduleNumber - b.moduleNumber).map((mod) => (
                    <div key={mod._id} className="bg-white p-8 rounded-3xl border border-gray-100 flex justify-between items-center group hover:border-indigo-200 transition duration-300 shadow-sm hover:shadow-xl">
                        <div className="flex items-center gap-8">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                                {mod.moduleNumber}
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-gray-900 leading-tight mb-1">{mod.title}</h4>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1">
                                        <Book size={12} className="text-gray-400" />
                                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest truncate max-w-[150px]">
                                            {courses.find(c => c._id === mod.courseId)?.title || 'Unassigned'}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{mod.content?.length || 0} Lessons</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition duration-300 translate-x-4 group-hover:translate-x-0">
                            <button
                                onClick={() => { setEditingId(mod._id); setEditFormData({ ...mod }); }}
                                className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => handleDeleteModule(mod._id)}
                                className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition shadow-sm"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
