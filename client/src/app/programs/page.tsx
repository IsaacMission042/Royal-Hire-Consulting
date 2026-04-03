import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, CheckCircle, Clock, GraduationCap } from 'lucide-react';

export default function Programs() {
    const modules = [
        { title: "Course Foundations", desc: "Setting the stage for professional growth and understanding the Royal Hire framework." },
        { title: "Advanced Market Analysis", desc: "Techniques for researching and understanding market dynamics at a global scale." },
        { title: "Strategic Resource Planning", desc: "Optimizing human and financial resources for maximum organizational output." },
        { title: "Professional Communication", desc: "Mastering the art of high-stakes negotiation and effective storytelling." },
        { title: "Leadership & Management", desc: "Developing the emotional intelligence and tactical skills of a modern leader." },
        { title: "Financial Intelligence", desc: "Deep dive into corporate finance, budgeting, and investment strategies." },
        { title: "Capstone Project", desc: "Integration of all modules into a comprehensive terminal project for graduation." }
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="py-20 bg-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">Our Training Programs</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A comprehensive, 7-module curriculum designed to take you from foundational knowledge to professional mastery.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Why Our Program?</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: <Clock className="text-purple-700" />, title: "Self-Paced Learning", desc: "Complete each module at your own speed with lifetime access to materials." },
                                    { icon: <CheckCircle className="text-purple-700" />, title: "Practical Assignments", desc: "Apply what you learn with real-world scenarios and expert feedback." },
                                    { icon: <GraduationCap className="text-purple-700" />, title: "Recognized Certification", desc: "Earn a certificate of completion that is respected by industry leaders." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{item.title}</h4>
                                            <p className="text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 p-8 bg-purple-900 rounded-3xl text-white">
                                <h3 className="text-2xl font-bold mb-4">Enrollment Status</h3>
                                <p className="text-purple-200 mb-6">Current cohort is now open for registration. Join 500+ professionals starting their journey this month.</p>
                                <div className="text-3xl font-black mb-6">₦25,000.00 <span className="text-sm font-normal opacity-70">One-time fee</span></div>
                                <button className="w-full py-4 bg-yellow-400 text-purple-900 font-bold rounded-xl hover:bg-yellow-500 transition shadow-lg">
                                    Secure Your Seat
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold mb-6">Curriculum Breakdown</h3>
                            {modules.map((m, i) => (
                                <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-purple-200 transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Module {i + 1}</span>
                                        <BookOpen size={16} className="text-gray-300" />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{m.title}</h4>
                                    <p className="text-sm text-gray-500">{m.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
