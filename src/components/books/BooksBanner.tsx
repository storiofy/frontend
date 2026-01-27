export default function BooksBanner() {
    return (
        <div className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white py-10 lg:py-12 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="relative group mb-4">
                        <div className="absolute -inset-2 bg-white/20 rounded-2xl blur-lg group-hover:bg-white/30 transition duration-300"></div>
                        <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
                            <img
                                src="/logo.png"
                                alt="Storiofy Logo"
                                className="w-10 h-10 object-contain transform group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white">
                        Personalized Storybooks
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-indigo-100 max-w-3xl mx-auto">
                        Every story is unique, crafted perfectly for your little hero
                    </p>

                    {/* Stats */}
                    <div className="mt-8 flex flex-wrap justify-center gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-0.5">50+</div>
                            <div className="text-xs text-indigo-200">Unique Stories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-0.5">10k+</div>
                            <div className="text-xs text-indigo-200">Happy Families</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-0.5">4.9★</div>
                            <div className="text-xs text-indigo-200">Average Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
