import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import { Filter, Search } from 'lucide-react';
import { ImageWithFallback } from '@components/figma/ImageWithFallback';
import { useCurrencyStore } from '@store/currencyStore';
import { getCurrencySymbol } from '@lib/utils/currency';

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
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const fetchBooks = async (params: any): Promise<BooksResponse> => {
    const response = await apiClient.get<BooksResponse>('/books', { params });
    return response.data;
};

export default function BooksPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { currency } = useCurrencyStore();

    // Filter states
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [idealFor, setIdealFor] = useState<string | null>(searchParams.get('ideal_for') || null);
    const [ageMin, setAgeMin] = useState<number | null>(
        searchParams.get('age_min') ? parseInt(searchParams.get('age_min')!) : null
    );
    const [ageMax, setAgeMax] = useState<number | null>(
        searchParams.get('age_max') ? parseInt(searchParams.get('age_max')!) : null
    );
    const [featured, setFeatured] = useState<string | null>(searchParams.get('featured') || null);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

    const debouncedSearch = useDebounce(search, 300);

    const apiParams = useMemo(() => {
        const params: any = { page, limit: 12 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (idealFor) params.ideal_for = idealFor;
        if (ageMin !== null) params.age_min = ageMin;
        if (ageMax !== null) params.age_max = ageMax;
        if (featured) params.featured = featured;
        return params;
    }, [debouncedSearch, idealFor, ageMin, ageMax, featured, page]);

    const { data, isLoading, isFetching } = useQuery<BooksResponse>({
        queryKey: ['books', apiParams, currency],
        queryFn: () => fetchBooks(apiParams),
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (idealFor) params.set('ideal_for', idealFor);
        if (ageMin !== null) params.set('age_min', ageMin.toString());
        if (ageMax !== null) params.set('age_max', ageMax.toString());
        if (featured) params.set('featured', featured);
        if (page > 1) params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    }, [debouncedSearch, idealFor, ageMin, ageMax, featured, page, setSearchParams]);

    const handleClearFilters = () => {
        setSearch('');
        setIdealFor(null);
        setAgeMin(null);
        setAgeMax(null);
        setFeatured(null);
        setPage(1);
    };

    const books = data?.items || [];
    const pagination = data?.pagination;

    return (
        <div className="bg-gray-50 flex-1">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-pink-500 to-blue-400 text-white py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <h1 className="text-2xl font-bold mb-2">Our Storybooks</h1>
                    <p className="text-sm text-pink-50">Browse our collection of personalized storybooks for children</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-56 flex-shrink-0">
                        <div className="bg-white rounded-lg p-4 shadow-sm sticky top-20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <h2 className="font-semibold text-sm">Filters</h2>
                                </div>
                                <button onClick={handleClearFilters} className="text-xs text-pink-600 hover:underline">Clear</button>
                            </div>

                            {/* Search */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-700 mb-2 block">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search books..."
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Featured */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-700 mb-2 block">Featured</label>
                                <select
                                    value={featured || ''}
                                    onChange={(e) => setFeatured(e.target.value || null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    <option value="">All</option>
                                    <option value="bestseller">Bestsellers</option>
                                    <option value="new">New Releases</option>
                                </select>
                            </div>

                            {/* Age Range */}
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-700 mb-2 block">Age Range</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={ageMin || ''}
                                        onChange={(e) => setAgeMin(e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={ageMax || ''}
                                        onChange={(e) => setAgeMax(e.target.value ? parseInt(e.target.value) : null)}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Books Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{books.length}</span> {isLoading || isFetching ? '...' : 'books'}
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array(6).fill(0).map((_, i) => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />)}
                            </div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {books.map((book) => (
                                        <div key={book.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
                                            <Link to={`/books/${book.slug}`} className="block relative">
                                                <ImageWithFallback
                                                    src={book.coverImageUrl}
                                                    alt={book.title}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                                />
                                                {book.discountPercentage && book.discountPercentage > 0 && (
                                                    <span className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                        -{book.discountPercentage}% OFF
                                                    </span>
                                                )}
                                                {book.isBestseller && (
                                                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                                                        Bestseller
                                                    </span>
                                                )}
                                            </Link>
                                            <div className="p-4">
                                                <Link to={`/books/${book.slug}`}>
                                                    <h3 className="font-semibold text-sm mb-1 hover:text-pink-600 transition line-clamp-1">
                                                        {book.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{book.shortDescription}</p>
                                                <p className="text-xs text-gray-500 mb-2">Ages {book.ageMin}-{book.ageMax}</p>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div>
                                                        <span className="text-lg font-bold text-pink-600">{getCurrencySymbol(currency)}{book.finalPrice}</span>
                                                        {book.basePrice > book.finalPrice && (
                                                            <span className="text-xs text-gray-400 line-through ml-2">{getCurrencySymbol(currency)}{book.basePrice}</span>
                                                        )}
                                                    </div>
                                                    <Link
                                                        to={`/books/${book.slug}/personalise`}
                                                        className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:from-pink-600 hover:to-blue-600 transition"
                                                    >
                                                        Personalize
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="mt-8 flex justify-center gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setPage(i + 1)}
                                                    className={`w-8 h-8 rounded-md text-sm transition-colors ${page === i + 1 ? 'bg-pink-600 text-white' : 'hover:bg-gray-100'}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                            disabled={page === pagination.totalPages}
                                            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {!isLoading && books.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No books found matching your filters.</p>
                                <button onClick={handleClearFilters} className="mt-4 text-pink-600 font-semibold">Clear all filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
