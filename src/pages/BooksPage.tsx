import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import BooksBanner from '@components/books/BooksBanner';
import BooksFilters from '@components/books/BooksFilters';
import ProductCard from '@components/product/ProductCard';

interface BookListItem {
    id: string;
    slug: string;
    title: string;
    shortDescription?: string;
    coverImageUrl: string;
    idealFor: string;
    ageMin: number;
    ageMax: number;
    genre?: string;
    pageCount: number;
    basePrice: number;
    discountPercentage?: number;
    finalPrice: number;
    isFeatured: boolean;
    isBestseller: boolean;
}

interface BooksResponse {
    items: BookListItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const fetchBooks = async (params: any): Promise<BooksResponse> => {
    const response = await apiClient.get<BooksResponse>('/books', { params });
    return response.data;
};

export default function BooksPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get initial values from URL params
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [idealFor, setIdealFor] = useState<string | null>(searchParams.get('ideal_for') || null);
    const [ageMin, setAgeMin] = useState<number | null>(
        searchParams.get('age_min') ? parseInt(searchParams.get('age_min')!) : null
    );
    const [ageMax, setAgeMax] = useState<number | null>(
        searchParams.get('age_max') ? parseInt(searchParams.get('age_max')!) : null
    );
    const [language, setLanguage] = useState<string | null>(searchParams.get('language') || null);
    const [featured, setFeatured] = useState<string | null>(searchParams.get('featured') || null);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

    // Debounce search input
    const debouncedSearch = useDebounce(search, 300);

    // Build API params
    const apiParams = useMemo(() => {
        const params: any = {
            page,
            limit: 12,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (idealFor) params.ideal_for = idealFor;
        if (ageMin !== null) params.age_min = ageMin;
        if (ageMax !== null) params.age_max = ageMax;
        if (language) params.language = language;
        if (featured) params.featured = featured;

        return params;
    }, [debouncedSearch, idealFor, ageMin, ageMax, language, featured, page]);

    // Fetch books
    const { data, isLoading, error, isFetching } = useQuery<BooksResponse>({
        queryKey: ['books', apiParams],
        queryFn: () => fetchBooks(apiParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (idealFor) params.set('ideal_for', idealFor);
        if (ageMin !== null) params.set('age_min', ageMin.toString());
        if (ageMax !== null) params.set('age_max', ageMax.toString());
        if (language) params.set('language', language);
        if (featured) params.set('featured', featured);
        if (page > 1) params.set('page', page.toString());

        setSearchParams(params, { replace: true });
    }, [debouncedSearch, idealFor, ageMin, ageMax, language, featured, page, setSearchParams]);

    // Check for featured filter from URL on mount
    useEffect(() => {
        const urlFeatured = searchParams.get('featured');
        if (urlFeatured) {
            setFeatured(urlFeatured);
        }
    }, [searchParams]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to first page on new search
    };

    const handleIdealForChange = (value: string | null) => {
        setIdealFor(value);
        setPage(1);
    };

    const handleAgeChange = (min: number | null, max: number | null) => {
        setAgeMin(min);
        setAgeMax(max);
        setPage(1);
    };

    const handleLanguageChange = (value: string | null) => {
        setLanguage(value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch('');
        setIdealFor(null);
        setAgeMin(null);
        setAgeMax(null);
        setLanguage(null);
        setFeatured(null);
        setPage(1);
    };

    const books = data?.items || [];
    const pagination = data?.pagination;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <BooksBanner />
            <BooksFilters
                search={search}
                idealFor={idealFor}
                ageMin={ageMin}
                ageMax={ageMax}
                language={language}
                onSearchChange={handleSearchChange}
                onIdealForChange={handleIdealForChange}
                onAgeChange={handleAgeChange}
                onLanguageChange={handleLanguageChange}
                onClearFilters={handleClearFilters}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Results Count */}
                {!isLoading && pagination && (
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{books.length}</span> of{' '}
                            <span className="font-semibold text-gray-900">{pagination.total}</span> books
                        </p>
                        {isFetching && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Updating...</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 rounded-2xl animate-pulse"
                                style={{ height: '480px' }}
                            />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Failed to load books
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Please try again later or contact support if the problem persists.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Retry</span>
                        </button>
                    </div>
                )}

                {/* Books Grid */}
                {!isLoading && !error && (
                    <>
                        {books.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {books.map((book) => (
                                        <ProductCard
                                            key={book.id}
                                            id={book.id}
                                            slug={book.slug}
                                            title={book.title}
                                            shortDescription={book.shortDescription}
                                            coverImageUrl={book.coverImageUrl}
                                            discountPercentage={book.discountPercentage}
                                            ageMin={book.ageMin}
                                            ageMax={book.ageMax}
                                            basePrice={book.basePrice}
                                            finalPrice={book.finalPrice}
                                            productType="book"
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="mt-12 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1 || isFetching}
                                            className="px-5 py-2.5 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 disabled:hover:bg-white"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (pagination.totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (page >= pagination.totalPages - 2) {
                                                    pageNum = pagination.totalPages - 4 + i;
                                                } else {
                                                    pageNum = page - 2 + i;
                                                }
                                                
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        disabled={isFetching}
                                                        className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                                                            page === pageNum
                                                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                            disabled={page === pagination.totalPages || isFetching}
                                            className="px-5 py-2.5 border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 disabled:hover:bg-white"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    No books found
                                </h3>
                                <p className="text-gray-600 text-lg mb-6">
                                    Try adjusting your filters or search terms
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Clear Filters</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
