"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  BookOpen,
  Clock,
  Award,
  Play,
  LogOut,
  ArrowRight,
  Users,
  Menu,
  X,
  Video,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get("/courses/user/enrolled");
        setEnrollments(res.data);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const totalCourses = enrollments.length;
  const activeCourses = enrollments.filter((e) => e.status === "active").length;
  const completedCourses = enrollments.filter(
    (e) => e.status === "completed",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-purple-900 text-white p-4 flex justify-between items-center z-50">
        <span className="font-black text-lg tracking-tighter">ROYAL HIRE</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-72 bg-purple-900 text-white flex flex-col fixed inset-y-0 shadow-2xl z-50 lg:hidden"
            >
              <div className="p-8 border-b border-purple-800">
                <span className="text-2xl font-black text-white tracking-tighter">
                  ROYAL HIRE
                </span>
              </div>
              <nav className="flex-1 p-6 space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/50 text-white font-bold transition shadow-sm"
                >
                  <BookOpen size={18} /> My Courses
                </Link>
                <Link
                  href="input the link for the courses"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl text-purple-200/70 hover:bg-purple-800/30 hover:text-white transition font-bold"
                >
                  <Award size={18} /> Browse Catalog
                </Link>
              </nav>
              <div className="p-6 border-t border-purple-800">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-4 text-purple-200/60 hover:bg-purple-800/50 hover:text-white rounded-xl transition font-bold uppercase text-xs tracking-widest"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="w-72 bg-purple-900 text-white hidden lg:flex flex-col fixed inset-y-0 shadow-2xl">
        <div className="p-8 border-b border-purple-800 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex flex-col items-start"
          >
            <span className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
              ROYAL HIRE
            </span>
            <div className="flex items-center gap-2 w-full">
              <div className="h-[1px] flex-1 bg-yellow-400" />
              <span className="text-[9px] font-black text-purple-300 tracking-[0.3em] uppercase">
                CONSULTING
              </span>
              <div className="h-[1px] flex-1 bg-yellow-400" />
            </div>
          </motion.div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <div className="px-4 py-2 text-xs font-bold text-purple-300 uppercase tracking-widest">
            Main Menu
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/50 text-white font-bold transition shadow-sm"
          >
            <BookOpen size={18} /> My Courses
          </Link>
          <Link
            href="input the link for the code"
            className="flex items-center gap-3 p-4 rounded-xl text-purple-200/70 hover:bg-purple-800/30 hover:text-white transition font-bold"
          >
            <Award size={18} /> Browse Catalog
          </Link>
        </nav>

        <div className="p-6 border-t border-purple-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-4 text-purple-200/60 hover:bg-purple-800/50 hover:text-white rounded-xl transition font-bold uppercase text-xs tracking-widest"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col">
        <header className="bg-white border-b border-gray-100 py-6 px-10 flex justify-between items-center sticky top-0 z-10 mt-16 lg:mt-0">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black text-gray-900 uppercase tracking-tight"
            >
              Student Dashboard
            </motion.h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Welcome back, {user?.name || "Student"}
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-900"
          >
            Browse Courses <ArrowRight size={16} />
          </Link>
        </header>

        <div className="p-10 max-w-6xl mx-auto w-full space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "Enrolled Courses",
                value: totalCourses,
                icon: <BookOpen className="text-blue-600" />,
                color: "bg-blue-50",
              },
              {
                label: "Active Learning",
                value: activeCourses,
                icon: <Clock className="text-purple-600" />,
                color: "bg-purple-50",
              },
              {
                label: "Completed",
                value: completedCourses,
                icon: <Award className="text-green-600" />,
                color: "bg-green-50",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-6"
              >
                <div
                  className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <h4 className="text-3xl font-black text-gray-900 mt-1">
                    {stat.value}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live Sessions Section */}
          {enrollments.some(e => e.course.googleMeetLink) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Video size={120} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <span className="inline-block px-4 py-1.5 bg-yellow-400 text-indigo-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                    Live Session Active
                  </span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Live Class Access</h3>
                  <p className="text-indigo-100 font-medium max-w-md">Your instructor has posted a Google Meet link for your scheduled session. Click below to join now.</p>
                </div>
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    {enrollments.filter(e => e.course.googleMeetLink).map(e => (
                        <a
                            key={e._id}
                            href={e.course.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-yellow-400 hover:text-indigo-900 transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            <Video size={20} className="group-hover:scale-110 transition" />
                            Join {e.course.title.split(' ')[0]} Session
                        </a>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Enrolled Courses List */}
          <div>
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                My Courses
              </h3>
            </div>

            {enrollments.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <BookOpen size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">
                  No courses enrolled yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your learning journey today.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center px-6 py-3 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment, i) => (
                  <motion.div
                    key={enrollment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="h-32 bg-gray-100 rounded-2xl mb-6 relative overflow-hidden">
                      {enrollment.course.thumbnail ? (
                        <img
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-200">
                          <BookOpen size={32} />
                        </div>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {enrollment.course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                      <Users size={14} />
                      <span>
                        {enrollment.course.instructor?.name || "Instructor"}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>

                      <Link
                        href={`/courses/${enrollment.course._id}`}
                        className="block w-full py-3 text-center bg-gray-900 text-white font-bold rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2 mb-3"
                      >
                        <Play size={16} fill="currentColor" /> Continue Learning
                      </Link>

                      {enrollment.course.googleMeetLink && (
                        <a
                          href={enrollment.course.googleMeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-3 text-center bg-indigo-50 text-indigo-700 font-black rounded-xl hover:bg-indigo-100 transition flex items-center justify-center gap-2 border border-indigo-100 uppercase text-xs tracking-widest"
                        >
                          <Video size={16} className="text-indigo-600" /> Join Live Session
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
