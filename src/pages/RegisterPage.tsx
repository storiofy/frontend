import RegisterForm from '@components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@components/layout/Logo';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative flex items-center justify-center p-6 md:p-12 overflow-hidden">

            {/* Background Magic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                {/* Left Panel - Form Area */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col order-2 lg:order-1"
                >
                    <div className="lg:hidden text-center mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <Logo />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">Storiofy</span>
                        </Link>
                    </div>

                    <RegisterForm />

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition flex items-center justify-center gap-2">
                            Back to home
                        </Link>
                    </div>
                </motion.div>

                {/* Right Panel - Hero Content */}
                <div className="hidden lg:flex flex-col space-y-12 order-1 lg:order-2">
                    <div className="space-y-6">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <div className="group-hover:scale-110 transition-transform">
                                <Logo />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">Storiofy</span>
                        </Link>

                        <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                            Create your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 italic">Magic ID</span>
                        </h2>

                        <p className="text-lg font-bold text-gray-400 max-w-sm leading-relaxed">
                            Join our community of storytellers and start creating personalized adventures that last a lifetime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { icon: Zap, color: 'text-blue-500', title: 'Instant Setup', desc: 'Starting takes less than 30 seconds' },
                            { icon: Shield, color: 'text-emerald-400', title: 'Secure Vault', desc: 'Your stories and photos are safe with us' },
                            { icon: Globe, color: 'text-purple-500', title: 'Global Delivery', desc: 'We ship magic to over 50 countries' }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: 20, opacity: 0 }}
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

                    <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-2xl"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Magic Preview</p>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-24 bg-white/10 rounded-xl animate-pulse"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
                                <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                                <div className="pt-2 flex items-center gap-2 text-blue-400">
                                    <div className="scale-50"><Logo /></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">Personalizing...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
