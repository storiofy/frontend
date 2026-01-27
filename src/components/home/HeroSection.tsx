import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="relative w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px] lg:min-h-[500px]">
                    {/* Left Side - Content */}
                    <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 lg:py-12 order-1">
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 max-w-xl text-center lg:text-left">
                            {/* Tagline */}
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
                                <span className="text-xl">✨</span>
                                <p className="text-white text-xs font-semibold tracking-wide">
                                    CREATE YOUR MAGICAL STORY
                                </p>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                                Where You're
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                                    The Hero
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-base sm:text-lg text-indigo-100 mb-6 leading-relaxed">
                                Personalized storybooks that bring your child's imagination to life
                            </p>

                            {/* CTA Button */}
                            <Link
                                to="/books"
                                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-base hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform duration-200"
                            >
                                <span>Explore Books</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>

                            {/* Features */}
                            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4 text-xs sm:text-sm text-indigo-100">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Fully Personalized</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>High Quality Print</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Fast Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative w-full h-[280px] lg:h-auto order-2 bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Decorative Book Illustration */}
                            <div className="relative w-full h-full max-w-md mx-auto p-8">
                                {/* Floating Books Animation */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-56 h-72 scale-90 lg:scale-100">
                                        {/* Book 1 - Main */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-2xl rotate-3 flex items-center justify-center">
                                            <div className="text-white text-center p-6">
                                                <div className="text-4xl mb-2">📖</div>
                                                <div className="font-bold text-lg">Your Story</div>
                                                <div className="text-sm opacity-75">Awaits</div>
                                            </div>
                                        </div>
                                        {/* Book 2 - Behind */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-xl -rotate-6 -translate-y-2 -z-10"></div>
                                        {/* Book 3 - Behind */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-xl shadow-lg rotate-12 translate-y-4 -z-20"></div>

                                        {/* Floating Stars */}
                                        <div className="absolute top-4 right-8 text-3xl animate-bounce">⭐</div>
                                        <div className="absolute bottom-8 left-4 text-2xl animate-pulse">✨</div>
                                        <div className="absolute top-12 left-8 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
