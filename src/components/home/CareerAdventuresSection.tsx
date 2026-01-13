import { useNavigate } from 'react-router-dom';

interface CareerOption {
    id: string;
    name: string;
    icon: string;
    genre: string;
}

const careers: CareerOption[] = [
    {
        id: 'firefighter',
        name: 'Firefighter',
        icon: '🚒',
        genre: 'firefighter',
    },
    {
        id: 'police',
        name: 'Police Officer',
        icon: '👮',
        genre: 'police',
    },
    {
        id: 'pilot',
        name: 'Pilot',
        icon: '✈️',
        genre: 'pilot',
    },
    {
        id: 'doctor',
        name: 'Doctor',
        icon: '👨‍⚕️',
        genre: 'doctor',
    },
];

export default function CareerAdventuresSection() {
    const navigate = useNavigate();

    const handleCareerClick = (genre: string) => {
        navigate(`/books?genre=${genre}`);
    };

    const handleExploreClick = () => {
        navigate('/books?genre=career');
    };

    return (
        <section className="py-16 bg-gradient-to-br from-teal-50 to-green-50 relative overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                        PERSONALISED STORIES THAT CELEBRATE THEIR BIG DREAMS!
                    </h2>
                    <p className="text-xl lg:text-2xl text-gray-700 font-semibold">
                        Inspire Their Dreams with Hyper-personalised Career Adventures!
                    </p>
                </div>

                {/* Career Icons Layout */}
                <div className="flex flex-col items-center justify-center mb-8">
                    {/* Mobile Layout - Grid */}
                    <div className="lg:hidden grid grid-cols-2 gap-6 w-full max-w-md mb-8">
                        {careers.map((career) => (
                            <button
                                key={career.id}
                                onClick={() => handleCareerClick(career.genre)}
                                className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                                aria-label={`Explore ${career.name} books`}
                            >
                                <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl mb-2 group-hover:shadow-xl transition-shadow border-2 border-teal-200 group-hover:border-teal-400">
                                    {career.icon}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors text-center">
                                    {career.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Desktop Layout - Circular */}
                    <div className="hidden lg:flex flex-col items-center justify-center">
                        {/* Central Image Placeholder */}
                        <div className="relative mb-8">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 flex items-center justify-center shadow-lg border-4 border-white">
                                <span className="text-4xl lg:text-5xl">👧</span>
                            </div>
                        </div>

                        {/* Career Icons in Circular Layout */}
                        <div className="relative w-full max-w-2xl" style={{ minHeight: '400px' }}>
                            {/* Top Career */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <button
                                    onClick={() => handleCareerClick(careers[0].genre)}
                                    className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                                    aria-label={`Explore ${careers[0].name} books`}
                                >
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl lg:text-5xl mb-2 group-hover:shadow-xl transition-shadow border-2 border-teal-200 group-hover:border-teal-400">
                                        {careers[0].icon}
                                    </div>
                                    <span className="text-sm lg:text-base font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">
                                        {careers[0].name}
                                    </span>
                                </button>
                            </div>

                            {/* Left Career */}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                <button
                                    onClick={() => handleCareerClick(careers[1].genre)}
                                    className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                                    aria-label={`Explore ${careers[1].name} books`}
                                >
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl lg:text-5xl mb-2 group-hover:shadow-xl transition-shadow border-2 border-teal-200 group-hover:border-teal-400">
                                        {careers[1].icon}
                                    </div>
                                    <span className="text-sm lg:text-base font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">
                                        {careers[1].name}
                                    </span>
                                </button>
                            </div>

                            {/* Right Career */}
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                                <button
                                    onClick={() => handleCareerClick(careers[2].genre)}
                                    className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                                    aria-label={`Explore ${careers[2].name} books`}
                                >
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl lg:text-5xl mb-2 group-hover:shadow-xl transition-shadow border-2 border-teal-200 group-hover:border-teal-400">
                                        {careers[2].icon}
                                    </div>
                                    <span className="text-sm lg:text-base font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">
                                        {careers[2].name}
                                    </span>
                                </button>
                            </div>

                            {/* Bottom Career */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                <button
                                    onClick={() => handleCareerClick(careers[3].genre)}
                                    className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                                    aria-label={`Explore ${careers[3].name} books`}
                                >
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-4xl lg:text-5xl mb-2 group-hover:shadow-xl transition-shadow border-2 border-teal-200 group-hover:border-teal-400">
                                        {careers[3].icon}
                                    </div>
                                    <span className="text-sm lg:text-base font-semibold text-gray-700 group-hover:text-teal-600 transition-colors">
                                        {careers[3].name}
                                    </span>
                                </button>
                            </div>

                            {/* Decorative Lines */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <svg className="w-full h-full opacity-20">
                                    <line
                                        x1="50%"
                                        y1="50%"
                                        x2="50%"
                                        y2="0%"
                                        stroke="#14b8a6"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                    <line
                                        x1="50%"
                                        y1="50%"
                                        x2="0%"
                                        y2="50%"
                                        stroke="#14b8a6"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                    <line
                                        x1="50%"
                                        y1="50%"
                                        x2="100%"
                                        y2="50%"
                                        stroke="#14b8a6"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                    <line
                                        x1="50%"
                                        y1="50%"
                                        x2="50%"
                                        y2="100%"
                                        stroke="#14b8a6"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explore Button */}
                <div className="text-center">
                    <button
                        onClick={handleExploreClick}
                        className="inline-block bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                        Explore
                    </button>
                </div>
            </div>
        </section>
    );
}

