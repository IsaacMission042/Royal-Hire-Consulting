import React from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Metadata } from 'next';
import BackButton from '@/components/ui/BackButton';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-block relative group">
            <div className="absolute -inset-4 bg-yellow-400/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-purple-700 tracking-tighter leading-none mb-1">
                ROYAL HIRE
              </span>
              <div className="flex items-center gap-3 w-full">
                <div className="h-[2px] flex-1 bg-yellow-400" />
                <span className="text-xs font-black text-slate-900 tracking-[0.4em] uppercase">
                  CONSULTING
                </span>
                <div className="h-[2px] flex-1 bg-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 404 Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-8xl font-black text-purple-100 mb-4">404</div>
          <h1 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          <div className="space-y-4">
            <Link 
              href="/"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition shadow-lg"
            >
              <Home size={18} />
              Go Home
            </Link>
            <Link 
              href="/courses"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              <Search size={18} />
              Browse Courses
            </Link>

            <BackButton />
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-6">
          Need help? <Link href="/contact" className="text-purple-700 hover:underline font-medium">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}