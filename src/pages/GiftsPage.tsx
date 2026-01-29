import { ArrowRight, ShoppingBag, Heart, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '@components/layout/Logo';

export default function GiftsPage() {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-pink-50 via-white to-blue-50 py-12 px-4 overflow-hidden relative flex flex-col justify-center">

            {/* Background Magic */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto w-full relative">

                {/* Header - Compact */}
                <div className="text-center mb-10 space-y-4">
                    <Link to="/" className="inline-flex items-center gap-2 justify-center mb-4 group">
                        <Logo />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">Storiofy</span>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-gray-100 mb-2"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Magical Gifting</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-gray-900 tracking-tighter leading-none"
                    >
                        Personalized <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Treasures</span>
                    </motion.h1>
                </div>

                {/* Coming Soon / Placeholder Section - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-pink-50 rounded-bl-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-tr-full blur-3xl opacity-50"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-gray-200 animate-bounce">
                            <Logo />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Magical Gifts Coming Soon!</h2>
                            <p className="text-gray-400 font-bold max-w-lg mx-auto leading-relaxed text-sm">
                                We're weaving magic into our new collection of accessories.
                                Sign up to be the first to know when the vault opens.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 justify-center items-center pt-4">
                            <div className="w-full max-w-xs">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full h-12 px-5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white transition-all outline-none font-bold text-gray-900 text-sm"
                                />
                            </div>
                            <button className="h-12 px-8 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95">
                                Notify Me <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: ShoppingBag, label: "Unique Items" },
                                { icon: Heart, label: "Handcrafted" },
                                { icon: Timer, label: "Early Access" },
                                { icon: Logo, label: "Pure Magic" }
                            ].map((feature, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mx-auto text-pink-500">
                                        {feature.icon === Logo ? <div className="scale-75"><feature.icon /></div> : <feature.icon className="w-5 h-5" />}
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{feature.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Back to Home link */}
                <div className="mt-8 text-center">
                    <Link to="/" className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition flex items-center justify-center gap-2">
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
