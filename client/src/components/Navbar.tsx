"use client";
import React from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center py-2 text-purple-700">
                        <Link href="/" className="hover:opacity-90 transition-opacity active:scale-95 transition-transform duration-200 block group">
                            <div className="relative flex flex-col items-start">
                                <span className="text-2xl font-black tracking-tighter leading-none mb-0.5">
                                    ROYAL HIRE
                                </span>
                                <div className="flex items-center gap-1.5 w-full">
                                    <div className="h-[1.5px] flex-1 bg-yellow-400" />
                                    <span className="text-[7px] font-black text-slate-900 tracking-[0.3em] uppercase">
                                        CONSULTING
                                    </span>
                                    <div className="h-[1.5px] flex-1 bg-yellow-400" />
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-gray-700 hover:text-purple-700 font-bold">Home</Link>
                        <Link href="/about" className="text-gray-700 hover:text-purple-700 font-bold">About</Link>
                        <Link href="/courses" className="text-gray-700 hover:text-purple-700 font-bold">Programs</Link>
                        <Link href="/admin-login" className="text-purple-700 hover:text-purple-900 font-black uppercase text-xs tracking-widest border-b-2 border-transparent hover:border-purple-700 transition-all">
                            Admin
                        </Link>
                        <Link href="/login" className="px-6 py-2 text-purple-700 font-bold border-2 border-purple-700 rounded-xl hover:bg-purple-50 transition shadow-sm">
                            Login
                        </Link>
                        <Link href="/register" className="px-6 py-2 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition shadow-lg">
                            Get Started
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4">
                    <Link href="/" className="block text-gray-700 font-medium">Home</Link>
                    <Link href="/about" className="block text-gray-700 font-medium">About</Link>
                    <Link href="/courses" className="block text-gray-700 font-medium">Programs</Link>
                    <div className="pt-4 space-y-4">
                        <Link href="/login" className="block w-full text-center py-2 text-purple-700 border border-purple-700 rounded-lg">Login</Link>
                        <Link href="/register" className="block w-full text-center py-2 bg-purple-700 text-white rounded-lg">Get Started</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
