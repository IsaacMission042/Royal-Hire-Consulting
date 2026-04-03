"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck, Lock, Key, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function Register() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Payment, 3: OTP, 4: Password, 5: Course, 6: Profile
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [profileData, setProfileData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        gender: 'Male',
        educationalBackground: ''
    });

    useEffect(() => {
        // Load Paystack script
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        // Fetch courses for step 5
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch courses");
            }
        };
        fetchCourses();

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register-intent', { email });
            setStep(2);
        } catch (err: any) {
            alert(err.response?.data?.msg || "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaystackPayment = () => {
        if (!window.PaystackPop) {
            alert("Payment system is still loading. Please wait a moment.");
            return;
        }

        const handler = window.PaystackPop.setup({
            key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // This should be a public key
            email: email,
            amount: 25000 * 100, // Amount in kobo
            currency: 'NGN',
            callback: async (response: any) => {
                setIsLoading(true);
                try {
                    await api.post('/auth/verify-payment', {
                        email,
                        reference: response.reference
                    });
                    setStep(3);
                } catch (err) {
                    alert("Payment verification failed. Please contact support.");
                } finally {
                    setIsLoading(false);
                }
            },
            onClose: () => {
                alert('Transaction was not completed.');
            }
        });
        handler.openIframe();
    };

    const handleMockPayment = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/auth/verify-payment', {
                email,
                reference: 'MOCK_' + Date.now()
            });
            setStep(3);
        } catch (err) {
            alert("Payment verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            setStep(4);
        } catch (err: any) {
            alert(err.response?.data?.msg || "Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetupPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.post('/auth/setup-password', { email, otp, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setStep(5);
        } catch (err: any) {
            alert(err.response?.data?.msg || "Password setup failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCourseSelection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse) {
            alert("Please select a course");
            return;
        }
        setIsLoading(true);
        try {
            await api.post('/courses/choose-course', { courseId: selectedCourse });
            setStep(6);
        } catch (err: any) {
            alert(err.response?.data?.msg || "Course selection failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.put('/auth/update-profile', profileData);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.name = profileData.fullName;
            user.fullName = profileData.fullName;
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/dashboard';
        } catch (err) {
            window.location.href = '/dashboard';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="inline-block p-6 bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 mb-8 group hover:scale-105 transition-transform duration-500 ring-8 ring-purple-500/5">
                            <img src="/logo.jpg" alt="Logo" className="h-32 w-auto mix-blend-multiply" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {step === 1 ? "Get Started" : step === 3 ? "Verify Email" : step === 4 ? "Secure Your Account" : step === 5 ? "Choose Your Course" : "Welcome Aboard!"}
                        </h2>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="text-gray-400" size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-black"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-50 transition-all items-center gap-2"
                            >
                                {isLoading ? "Processing..." : <>Proceed to Payment <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="text-center space-y-6">
                            <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-100">
                                <h3 className="text-lg font-bold text-yellow-800 mb-2">Complete Your Enrollment</h3>
                                <p className="text-sm text-yellow-700">A one-time payment is required for full access.</p>
                                <div className="mt-4 text-2xl font-black text-gray-900">₦25,000.00</div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handleMockPayment}
                                    className="w-full py-4 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition"
                                >
                                    Pay with Card (Paystack)
                                </button>
                                <button onClick={() => setStep(1)} className="w-full py-2 text-gray-500 text-sm">Change Email</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <p className="text-center text-sm text-gray-600">Enter the 6-digit code sent to <b>{email}</b></p>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white text-center text-2xl font-bold tracking-widest text-black"
                                    placeholder="000000"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition"
                            >
                                {isLoading ? "Verifying..." : "Verify Code"}
                            </button>
                        </form>
                    )}

                    {step === 4 && (
                        <form onSubmit={handleSetupPassword} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-black"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-black"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition"
                            >
                                {isLoading ? "Setting Up..." : "Create Account"}
                            </button>
                        </form>
                    )}

                    {step === 5 && (
                        <form onSubmit={handleCourseSelection} className="space-y-6">
                            <p className="text-center text-sm text-gray-600">Select the program you wish to enroll in today.</p>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {courses.map((course) => (
                                    <label key={course._id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${selectedCourse === course._id ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                                        <input
                                            type="radio"
                                            name="course"
                                            value={course._id}
                                            onChange={() => setSelectedCourse(course._id)}
                                            className="hidden"
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900">{course.title}</div>
                                            <div className="text-xs text-gray-500">{course.category} • {course.level}</div>
                                        </div>
                                        {selectedCourse === course._id && <CheckCircle className="text-purple-600" size={20} />}
                                    </label>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !selectedCourse}
                                className="w-full py-3 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition disabled:opacity-50"
                            >
                                {isLoading ? "Enrolling..." : "Choose Course & Continue"}
                            </button>
                        </form>
                    )}

                    {step === 6 && (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-500">Provide legal details for your certificate.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Legal Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 p-3 rounded-xl border text-black"
                                    placeholder="John Doe"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-gray-50 p-3 rounded-xl border text-black"
                                        value={profileData.phoneNumber}
                                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
                                    <select
                                        className="w-full bg-gray-50 p-3 rounded-xl border text-black"
                                        value={profileData.gender}
                                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 p-3 rounded-xl border text-black"
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Education</label>
                                <textarea
                                    className="w-full bg-gray-50 p-3 rounded-xl border text-black"
                                    value={profileData.educationalBackground}
                                    onChange={(e) => setProfileData({ ...profileData, educationalBackground: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition"
                            >
                                {isLoading ? "Saving..." : "Enter Dashboard"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
