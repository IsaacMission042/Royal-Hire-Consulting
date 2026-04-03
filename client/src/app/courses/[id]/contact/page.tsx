import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Have questions about our programs or services? We're here to help you navigate your career journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 text-purple-700">
                                <Mail size={24} />
                            </div>
                            <h3 className="font-bold mb-2">Email Us</h3>
                            <p className="text-gray-500 text-sm">royalconsulting@gmail.com</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 text-purple-700">
                                <Phone size={24} />
                            </div>
                            <h3 className="font-bold mb-2">Call Us</h3>
                            <p className="text-gray-500 text-sm">+234 810 995 9538</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 text-purple-700">
                                <MapPin size={24} />
                            </div>
                            <h3 className="font-bold mb-2">Visit Us</h3>
                            <p className="text-gray-500 text-sm">First Floor 74
                                Bende Road, Umuahia, Abia State</p>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="p-8 md:p-12">
                            <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none">
                                        <option>General Inquiry</option>
                                        <option>Program Enrollment</option>
                                        <option>Corporate Partnership</option>
                                        <option>Technical Support</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="submit" className="w-full py-4 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition shadow-lg flex items-center justify-center gap-2">
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
