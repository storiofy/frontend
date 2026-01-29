import LoginForm from '@components/auth/LoginForm';
import { Link } from 'react-router-dom';
import { Star, Heart, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@components/layout/Logo';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative flex items-center justify-center p-6 md:p-12 overflow-hidden">

            {/* Background Magic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left Panel - Story Magic */}
                <div className="hidden lg:flex flex-col space-y-12">
                    <div className="space-y-6">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <div className="group-hover:scale-110 transition-transform">
                                <Logo />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">Storiofy</span>
                        </Link>

                        <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                            Continue the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 italic">Adventure</span>
                        </h2>

                        <p className="text-lg font-bold text-gray-400 max-w-sm leading-relaxed">
                            Sign in to access your saved stories, track your magical packages, and create new memories.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { icon: Star, color: 'text-amber-400', title: 'Your Favorites', desc: 'Quickly access stories you love' },
                            { icon: Bookmark, color: 'text-blue-500', title: 'Saved Progress', desc: 'Pick up exactly where you left off' },
                            { icon: Heart, color: 'text-pink-500', title: 'Gift History', desc: 'Manage your previous personalized gifts' }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="flex items-start gap-4 p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/50 shadow-sm"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ${feature.color}`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs">{feature.title}</h4>
                                    <p className="text-xs font-bold text-gray-400 mt-1">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            <span className="text-gray-900">10,000+</span> Happy Families <br />
                            <span className="text-pink-500">Creating Magic Together</span>
                        </p>
                    </div>
                </div>

                {/* Right Panel - Form Area */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col"
                >
                    <div className="lg:hidden text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <Logo />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">Storiofy</span>
                        </Link>
                    </div>

                    <LoginForm />

                    <div className="mt-8 text-center no-print">
                        <Link to="/" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition flex items-center justify-center gap-2">
                            Back to home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
