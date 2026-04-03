"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, FileText, Link as LinkIcon, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

export default function AssignmentManager() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        moduleNumber: '',
        description: '',
        instructions: '',
        submissionType: 'link',
        resources: [] as any[]
    });
    const [resourceInput, setResourceInput] = useState({ title: '', url: '' });

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/modules/assignments/all');
            setAssignments(res.data);
        } catch (err) {
            console.error("Failed to fetch assignments", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const data = {
                ...formData,
                moduleNumber: parseInt(formData.moduleNumber)
            };
            await api.post('/modules/assignments', data);
            fetchAssignments();
            setIsAdding(false);
            setEditingId(null);
            resetForm();
        } catch (err) {
            alert("Failed to save assignment");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/modules/assignments/${id}`);
            setAssignments(assignments.filter(a => a._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            moduleNumber: '',
            description: '',
            instructions: '',
            submissionType: 'link',
            resources: []
        });
    };

    const addResource = () => {
        if (!resourceInput.title || !resourceInput.url) return;
        setFormData({
            ...formData,
            resources: [...formData.resources, resourceInput]
        });
        setResourceInput({ title: '', url: '' });
    };

    const removeResource = (index: number) => {
        setFormData({
            ...formData,
            resources: formData.resources.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Assignment Manager</h3>
                <button
                    onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
                >
                    <Plus size={20} /> Create Assignment
                </button>
            </div>

            {(isAdding || editingId) && (
                <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <h4 className="font-black text-indigo-900 uppercase text-xs tracking-widest">{editingId ? 'Edit Assignment' : 'New Assignment'}</h4>
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assignment Title</label>
                            <input
                                type="text"
                                placeholder="e.g. SWOT Analysis Workbook"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Assign to Module #</label>
                            <input
                                type="number"
                                placeholder="1"
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={formData.moduleNumber}
                                onChange={(e) => setFormData({ ...formData, moduleNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Brief Description</label>
                            <textarea
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] font-medium"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Instructions</label>
                            <textarea
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] font-medium"
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Submission Type</label>
                            <select
                                className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                value={formData.submissionType}
                                onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                            >
                                <option value="link">Google Docs / External Link</option>
                                <option value="text">Direct Text Entry</option>
                                <option value="file">File Upload</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Add Resource Links</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Resource Name"
                                    className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-100 outline-none text-xs"
                                    value={resourceInput.title}
                                    onChange={(e) => setResourceInput({ ...resourceInput, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="URL"
                                    className="flex-2 bg-gray-50 p-2 rounded-lg border border-gray-100 outline-none text-xs"
                                    value={resourceInput.url}
                                    onChange={(e) => setResourceInput({ ...resourceInput, url: e.target.value })}
                                />
                                <button onClick={addResource} className="bg-indigo-100 text-indigo-700 p-2 rounded-lg"><Plus size={16} /></button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.resources.map((res, i) => (
                                    <div key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
                                        {res.title} <button onClick={() => removeResource(i)}><X size={10} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2 font-black text-gray-400 uppercase text-xs tracking-widest">Discard</button>
                        <button
                            onClick={handleSave}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100"
                        >
                            {editingId ? 'Update Assignment' : 'Publish Assignment'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {assignments.map((ass) => (
                    <div key={ass._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center group hover:border-indigo-200 transition duration-300 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-yellow-50 text-yellow-700 rounded-2xl flex items-center justify-center font-black">
                                M{ass.moduleNumber}
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900">{ass.title}</h4>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{ass.submissionType} submission</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                            <button
                                onClick={() => { setEditingId(ass._id); setFormData({ ...ass }); }}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(ass._id)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
