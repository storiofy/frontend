import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@lib/api/client';
import { useAuthStore } from '@store/authStore';
import GoogleAuthButton from './GoogleAuthButton';
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/auth/login', data);
            const { accessToken, refreshToken, userId, email, firstName, lastName, isAdmin } = response.data;

            setAuth(
                { id: userId, email, firstName, lastName, isAdmin: isAdmin || false },
                accessToken,
                refreshToken
            );

            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 md:p-12">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-[2rem] mb-6 shadow-xl shadow-pink-100">
                    <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back!</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Jump back into your story</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-gray-100 focus:border-pink-500 transition-all outline-none font-bold text-gray-900 focus:ring-4 focus:ring-pink-50 group-hover:border-gray-200"
                            placeholder="hero@storiofy.com"
                        />
                    </div>
                    {errors.email && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
                        <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-[0.1em] text-pink-500 hover:text-pink-600 transition">Forgot?</Link>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full h-14 pl-14 pr-6 rounded-2xl border-2 border-gray-100 focus:border-pink-500 transition-all outline-none font-bold text-gray-900 focus:ring-4 focus:ring-pink-50 group-hover:border-gray-200"
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.password.message}</p>}
                </div>

                {error && (
                    <div className="bg-rose-50 border-2 border-rose-100 text-rose-600 px-5 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                    {isLoading ? 'Entering...' : <>Continue Journey <ArrowRight className="w-4 h-4" /></>}
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-4 bg-white text-[10px] font-black uppercase tracking-widest text-gray-400">Or use magic</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <GoogleAuthButton label="Continue with Google" redirectTo="/" />
                </div>

                <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4">
                    New to Storiofy?{' '}
                    <Link to="/register" className="text-pink-500 hover:text-pink-600 transition ml-1">Create Account</Link>
                </p>
            </form>
        </div>
    );
}
