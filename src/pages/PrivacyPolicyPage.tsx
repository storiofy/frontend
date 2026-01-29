import { Shield, Lock, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '@components/layout/Logo';

export default function PrivacyPolicyPage() {
    const lastUpdated = 'January 27, 2025';

    const sections = [
        {
            icon: Shield,
            title: "1. Information We Collect",
            content: [
                { subtitle: "1.1 Personal Information", text: "We collect information you provide directly: name, email, phone, and password for account creation; billing and shipping details for orders." },
                { subtitle: "1.2 Automatically Collected", text: "Device info (IP, browser), usage data (pages visited), and general location via IP address are collected automatically to improve your experience." },
                { subtitle: "1.3 Children's Magic", text: "We only collect a child's name, age, and photo with verifiable parental consent, strictly for product personalization." }
            ]
        },
        {
            icon: Sparkles,
            title: "2. How We Use Magic",
            content: [
                { subtitle: "Service Delivery", text: "Processing orders, creating personalized books, and providing customer support." },
                { subtitle: "Improvement", text: "Analyzing usage patterns to build better magical features for your family." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-24 px-4 overflow-hidden relative">

            {/* Background Magic */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-pink-200/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="max-w-4xl mx-auto relative">

                {/* Header */}
                <div className="text-center mb-20 space-y-6">
                    <Link to="/" className="inline-flex items-center gap-2 justify-center mb-8 group">
                        <Logo />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">Storiofy</span>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 mb-2"
                    >
                        <Lock className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-100">Vault Privacy</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-black text-gray-900 tracking-tighter"
                    >
                        Privacy <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Policy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 font-bold text-sm uppercase tracking-widest"
                    >
                        Last Updated: {lastUpdated}
                    </motion.p>
                </div>

                {/* Content Cards */}
                <div className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-sm leading-relaxed"
                    >
                        <p className="text-lg font-bold text-gray-600">
                            At Storiofy, we are committed to protecting your privacy and the privacy of your children.
                            This policy explains how we keep your magical data safe and secure.
                        </p>
                    </motion.div>

                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500">
                                    <section.icon className="w-7 h-7" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{section.title}</h2>
                            </div>

                            <div className="space-y-10">
                                {section.content.map((item, i) => (
                                    <div key={i} className="group">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">{item.subtitle}</h3>
                                        <p className="text-gray-500 font-bold leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Simple List Section */}
                    <div className="bg-gray-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-bl-full blur-3xl"></div>
                        <h2 className="text-3xl font-black mb-8">Your Rights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Access your magic data",
                                "Correction of details",
                                "Right to full deletion",
                                "Opt-out of highlights",
                                "Data portability",
                                "Verpatch parental controls"
                            ].map((right, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
                                        <Check className="w-3 h-3 text-pink-400" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-gray-300">{right}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Panel */}
                    <div className="text-center py-20 space-y-6">
                        <h3 className="text-2xl font-black text-gray-900">Questions about the Vault?</h3>
                        <p className="text-gray-400 font-bold">Reach out to our magical privacy team anytime.</p>
                        <div className="flex justify-center gap-4 pt-4">
                            <a href="mailto:privacy@storiofy.com" className="h-14 px-8 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Email Privacy</span>
                            </a>
                            <a href="mailto:support@storiofy.com" className="h-14 px-8 bg-gray-900 text-white rounded-2xl flex items-center gap-3 shadow-lg hover:bg-black transition">
                                <Sparkles className="w-4 h-4 text-pink-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">General Support</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Check({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
    );
}
