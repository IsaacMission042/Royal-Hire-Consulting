import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms and Privacy Policy</h1>

                    <div className="prose prose-purple max-w-none space-y-8 text-gray-600">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using Royal Hire Consulting's platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Enrollment and Access</h2>
                            <p>
                                Enrollment in our programs is subject to payment of the specified fees. Upon successful payment, you will receive a unique access code. This code is personal and non-transferable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Policy</h2>
                            <p>
                                Due to the digital nature of our training modules, all sales are final. Refunds may only be considered in exceptional circumstances at the sole discretion of Royal Hire Consulting management.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Privacy Policy</h2>
                            <p>
                                We value your privacy. Your email address and personal data are used solely for the purpose of managing your enrollment and providing program updates. We do not sell your information to third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                            <p>
                                All course content, including videos, PDFs, and assignments, are the intellectual property of Royal Hire Consulting. Unauthorized distribution or reproduction of these materials is strictly prohibited.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
