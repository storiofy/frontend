import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@lib/api/client';
import { useAuthStore } from '@store/authStore';
import GoogleAuthButton from './GoogleAuthButton';

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post('/auth/register', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            });
            const { accessToken, refreshToken, userId, email, firstName, lastName, isAdmin } = response.data;

            // Store auth state using store
            setAuth(
                { id: userId, email, firstName, lastName, isAdmin: isAdmin || false },
                accessToken,
                refreshToken
            );

            // Redirect to home
            navigate('/');
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Registration failed. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Logo */}
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Create Account
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-600 mb-8 text-center">
                Join us and start creating your stories
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* First Name & Last Name - Side by side */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            First Name
                        </label>
                        <input
                            {...register('firstName')}
                            type="text"
                            id="firstName"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="First name"
                        />
                        {errors.firstName && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="lastName"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Last Name
                        </label>
                        <input
                            {...register('lastName')}
                            type="text"
                            id="lastName"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="Last name"
                        />
                        {errors.lastName && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Email Address
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Password
                    </label>
                    <input
                        {...register('password')}
                        type="password"
                        id="password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Confirm Password
                    </label>
                    <input
                        {...register('confirmPassword')}
                        type="password"
                        id="confirmPassword"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* Social Sign-up Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Facebook Button (not yet implemented) */}
                    <button
                        type="button"
                        disabled
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold opacity-60 cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Facebook</span>
                    </button>
                    
                    {/* Google Button */}
                    <GoogleAuthButton label="Google" redirectTo="/" />
                </div>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm pt-2">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
}
