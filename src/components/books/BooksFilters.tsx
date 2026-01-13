import { useState } from 'react';

interface BooksFiltersProps {
    search: string;
    idealFor: string | null;
    ageMin: number | null;
    ageMax: number | null;
    language: string | null;
    onSearchChange: (value: string) => void;
    onIdealForChange: (value: string | null) => void;
    onAgeChange: (min: number | null, max: number | null) => void;
    onLanguageChange: (value: string | null) => void;
    onClearFilters: () => void;
    searchPlaceholder?: string;
}

export default function BooksFilters({
    search,
    idealFor,
    ageMin,
    ageMax,
    language,
    onSearchChange,
    onIdealForChange,
    onAgeChange,
    onLanguageChange,
    onClearFilters,
    searchPlaceholder = 'Search books...',
}: BooksFiltersProps) {
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isAgeOpen, setIsAgeOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    const ageRanges = [
        { label: 'All Ages', min: null, max: null },
        { label: '2-4 years', min: 2, max: 4 },
        { label: '4-6 years', min: 4, max: 6 },
        { label: '6-8 years', min: 6, max: 8 },
        { label: '8-10 years', min: 8, max: 10 },
        { label: '10-12 years', min: 10, max: 12 },
        { label: '12+ years', min: 12, max: 18 },
    ];

    const languages = [
        { code: null, name: 'All Languages' },
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
    ];

    const hasActiveFilters = idealFor || ageMin || ageMax || language;

    return (
        <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Search Bar */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Gender Filter */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsGenderOpen(!isGenderOpen);
                                    setIsAgeOpen(false);
                                    setIsLanguageOpen(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-semibold transition-all ${
                                    idealFor
                                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 text-indigo-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                                <span className="text-sm">Gender</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        isGenderOpen ? 'transform rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            {isGenderOpen && (
                                <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    <button
                                        onClick={() => {
                                            onIdealForChange(null);
                                            setIsGenderOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                                            !idealFor ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-700'
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => {
                                            onIdealForChange('boy');
                                            setIsGenderOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                                            idealFor === 'boy' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-700'
                                        }`}
                                    >
                                        👦 Boys
                                    </button>
                                    <button
                                        onClick={() => {
                                            onIdealForChange('girl');
                                            setIsGenderOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                                            idealFor === 'girl' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-700'
                                        }`}
                                    >
                                        👧 Girls
                                    </button>
                                    <button
                                        onClick={() => {
                                            onIdealForChange('both');
                                            setIsGenderOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                                            idealFor === 'both' ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-700'
                                        }`}
                                    >
                                        Both
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Age Filter */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsAgeOpen(!isAgeOpen);
                                    setIsGenderOpen(false);
                                    setIsLanguageOpen(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-semibold transition-all ${
                                    ageMin || ageMax
                                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 text-indigo-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-sm">Age</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        isAgeOpen ? 'transform rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            {isAgeOpen && (
                                <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    {ageRanges.map((range) => (
                                        <button
                                            key={range.label}
                                            onClick={() => {
                                                onAgeChange(range.min, range.max);
                                                setIsAgeOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                                                ageMin === range.min && ageMax === range.max
                                                    ? 'text-indigo-600 font-semibold bg-indigo-50'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Language Filter */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsLanguageOpen(!isLanguageOpen);
                                    setIsGenderOpen(false);
                                    setIsAgeOpen(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-semibold transition-all ${
                                    language
                                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-300 text-indigo-700'
                                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span className="text-sm">Language</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${
                                        isLanguageOpen ? 'transform rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            {isLanguageOpen && (
                                <div className="absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code || 'all'}
                                            onClick={() => {
                                                onLanguageChange(lang.code);
                                                setIsLanguageOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                                                language === lang.code
                                                    ? 'text-indigo-600 font-semibold bg-indigo-50'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={onClearFilters}
                                className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Close dropdowns when clicking outside */}
            {(isGenderOpen || isAgeOpen || isLanguageOpen) && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => {
                        setIsGenderOpen(false);
                        setIsAgeOpen(false);
                        setIsLanguageOpen(false);
                    }}
                />
            )}
        </div>
    );
}
