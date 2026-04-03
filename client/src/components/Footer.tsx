import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-purple-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
                <div className="col-span-2">
                    <div className="mb-6 group">
                        <Link href="/" className="relative flex flex-col items-start w-fit">
                            <span className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                                ROYAL HIRE
                            </span>
                            <div className="flex items-center gap-2 w-full">
                                <div className="h-[1px] flex-1 bg-yellow-400" />
                                <span className="text-[9px] font-black text-purple-200 tracking-[0.3em] uppercase">
                                    CONSULTING
                                </span>
                                <div className="h-[1px] flex-1 bg-yellow-400" />
                            </div>
                        </Link>
                    </div>
                    <p className="text-purple-200 max-w-sm">
                        Your partner in professional growth. Providing quality e-learning and consulting services since inception.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4 uppercase text-purple-400 tracking-wider">Quick Links</h4>
                    <ul className="space-y-2 text-purple-100">
                        <li><Link href="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
                        <li><Link href="/programs" className="hover:text-yellow-400 transition">Programs</Link></li>
                        <li><Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
                        <li><Link href="/terms" className="hover:text-yellow-400 transition">Terms & Privacy</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 uppercase text-purple-400 tracking-wider">Connect</h4>
                    <ul className="space-y-2 text-purple-100">
                        <li><a href="https://web.facebook.com/people/ROYAL-HIRE-Consulting/61572376238558/#" target='_blank' className="hover:text-yellow-400 transition">Facebook</a></li>
                        <li><a href="https://www.linkedin.com/in/clare-onyegbu-8570ba257/" target='_blank' className="hover:text-yellow-400 transition">LinkedIn</a></li>
                        <li><a href="#" target='_blank' className="hover:text-yellow-400 transition">Instagram</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-purple-800 text-center text-purple-300 text-sm">
                © {new Date().getFullYear()} Royal Hire Consulting. All rights reserved.
            </div>
        </footer>
    );
}
