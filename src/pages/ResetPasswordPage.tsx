import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '@lib/api/client';
import Logo from '@components/layout/Logo';
import { Loader2, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ResetPasswordForm {
    password: string;
    confirmPassword: string;
}

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ResetPasswordForm>();

    const onSubmit = async (data: ResetPasswordForm) => {
        if (!token) return;

        setIsLoading(true);
        try {
            await authApi.resetPassword({
                token,
                newPassword: data.password
            });
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error('Invalid or expired token. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Invalid Link</h2>
                    <p className="text-gray-500 mt-2 mb-4">This password reset link is invalid or missing a token.</p>
                    <Link to="/forgot-password" className="text-blue-600 font-bold hover:underline">Request a new link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative flex items-center justify-center p-6 md:p-12 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white p-8 rounded-3xl shadow-xl relative z-10"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="group-hover:scale-110 transition-transform">
                            <Logo />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        New Password
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">
                        Create a strong password for your next adventure.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Must be at least 6 characters' }
                                })}
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs font-bold text-red-500 pl-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: val => val === watch('password') || 'Passwords do not match'
                                })}
                                type="password"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs font-bold text-red-500 pl-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transform transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set New Password'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-gray-100">
                    <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
