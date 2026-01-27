import RegisterForm from '@components/auth/RegisterForm';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 relative flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%234F46E5' fill-opacity='0.3'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left Panel - Registration Form */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <img
                                    src="/logo.png"
                                    alt="Storiofy Logo"
                                    className="w-12 h-12 object-contain"
                                />
                                <h1 className="text-3xl font-extrabold tracking-tight text-vibrant-brand">
                                    Storiofy
                                </h1>
                            </div>
                            <p className="text-gray-600">Create your account to get started</p>
                        </div>

                        <RegisterForm />

                        {/* Additional Links */}
                        <div className="mt-6 text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                            <Link
                                to="/"
                                className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                ← Back to home
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Promotional Content */}
                <div className="hidden lg:flex flex-col items-start justify-center space-y-8">
                    {/* Main Content Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full relative overflow-hidden">
                        {/* Decorative Element */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <img
                                    src="/logo.png"
                                    alt="Storiofy Logo"
                                    className="w-12 h-12 object-contain"
                                />
                                <h2 className="text-3xl font-extrabold tracking-tight text-vibrant-brand">
                                    Storiofy
                                </h2>
                            </div>

                            <h3 className="text-4xl font-bold text-gray-900 mb-4">
                                Start Your Journey!
                            </h3>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Join thousands of families creating magical memories with personalized stories.
                            </p>

                            {/* Benefits List */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Instant Access</h4>
                                        <p className="text-sm text-gray-600">Start creating immediately after signup</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Save Your Work</h4>
                                        <p className="text-sm text-gray-600">Access your stories anytime, anywhere</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Track Orders</h4>
                                        <p className="text-sm text-gray-600">Manage and track all your purchases</p>
                                    </div>
                                </div>
                            </div>

                            {/* Illustration */}
                            <div className="mt-8 flex justify-center">
                                <div className="relative">
                                    <div className="w-32 h-40 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-xl transform -rotate-3">
                                        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                                            📖
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
                                    <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">⭐</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-6 w-full">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">10k+</div>
                            <div className="text-xs text-gray-600">Users</div>
                        </div>
                        <div className="w-px h-10 bg-gray-300"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">50+</div>
                            <div className="text-xs text-gray-600">Stories</div>
                        </div>
                        <div className="w-px h-10 bg-gray-300"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">4.9★</div>
                            <div className="text-xs text-gray-600">Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Chat Widget */}
            <Link
                to="/support"
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center text-white hover:scale-110 transform duration-200"
                aria-label="Support"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </Link>
        </div>
    );
}
