"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, BookOpen, Clock, Users, GraduationCap, Globe, Shield } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import Counter from '@/components/Counter';

export default function Home() {
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.get('/courses'); // Changed to courses for correct school view
        if (Array.isArray(res.data)) {
          setModules(res.data);
        } else {
          setModules([]);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
        setModules([]);
      }
    };
    fetchModules();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section - School Style */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-purple-900 text-white">
        <div className="absolute inset-0 bg-[url('/hero-upgraded.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest uppercase">Admissions Open 2026/2027</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-none">
              ROYAL HIRE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">ACADEMY</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              A premier institution dedicated to sculpting the next generation of global leaders through rigorous, practical education.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="px-10 py-5 bg-yellow-500 text-purple-900 font-black rounded-xl hover:bg-yellow-400 transition shadow-xl shadow-yellow-900/20 text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                View Programs <BookOpen size={18} />
              </Link>
              <Link href="/register" className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-xl hover:bg-white/20 transition text-sm uppercase tracking-widest">
                Apply Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Trust Strip */}
      <div className="bg-purple-800 text-white py-12 border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-purple-700/50">
          <div>
            <div className="text-4xl font-black text-yellow-400 mb-1">
              <Counter n={50} suffix="+" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-300">Certified Courses</div>
          </div>
          <div>
            <div className="text-4xl font-black text-yellow-400 mb-1">
              <Counter n={10} suffix="k+" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-300">Alumni Network</div>
          </div>
          <div>
            <div className="text-4xl font-black text-yellow-400 mb-1">
              <Counter n={98} suffix="%" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-300">Job Placement</div>
          </div>
          <div>
            <div className="text-4xl font-black text-yellow-400 mb-1">
              <Counter n={24} suffix="/7" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-300">Student Support</div>
          </div>
        </div>
      </div>

      {/* About The School */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Campus Life" className="rounded-[2.5rem] shadow-2xl rotate-0 transition duration-500" />
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                <p className="font-serif italic text-gray-600">"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-900 rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Mrs Clare Onyegbu</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">CEO of Royal Hire Consulting</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4">Welcome to Royal Hire Academy</h4>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">World-Class Education for the Modern Era.</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We don't just teach modules; we shape careers. Our unique curriculum combines academic rigor with real-world application, ensuring that every graduate is industry-ready from day one.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Industry-Accredited Certification",
                  "Personalized Mentorship Programs",
                  "Global Alumni Community Access",
                  "Practical, Project-Based Learning"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <Shield className="text-green-500 shrink-0" size={20} /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/about" className="inline-flex h-12 items-center justify-center rounded-xl bg-purple-100 px-8 text-sm font-black text-purple-900 shadow-sm transition-colors hover:bg-purple-200 uppercase tracking-widest">
                Read Our Mission
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Academic Programs</h2>
            <div className="w-24 h-1.5 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
            <p className="text-gray-500 mt-4 font-medium">Explore our most popular departments and courses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {modules.length > 0 ? modules.slice(0, 3).map((course: any) => (
              <motion.div
                key={course._id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 group"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img src={course.thumbnail || '/bg.jpg'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-purple-900 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                    {course.level || 'Certificate'}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Users size={14} /> 120 Students
                    </div>
                    <Link href={`/courses/${course._id}`} className="text-purple-600 text-sm font-black uppercase tracking-widest hover:text-purple-800">
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Course catalog is being updated for the new semester.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest hover:text-purple-700 transition">
              View Full Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
