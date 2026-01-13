export default function BooksBanner() {
    return (
        <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white py-16 lg:py-20 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-white">
                        Personalized Storybooks
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 max-w-3xl mx-auto">
                        Every story is unique, crafted perfectly for your little hero
                    </p>

                    {/* Stats */}
                    <div className="mt-10 flex flex-wrap justify-center gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">50+</div>
                            <div className="text-sm text-indigo-200">Unique Stories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">10k+</div>
                            <div className="text-sm text-indigo-200">Happy Families</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                            <div className="text-sm text-indigo-200">Average Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
