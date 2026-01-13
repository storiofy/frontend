import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import BlogPostCard from '@components/blog/BlogPostCard';

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    featuredImageUrl: string;
    publishedAt: string;
    author?: string;
    category?: string;
    readTime?: number;
}

interface BlogResponse {
    items: BlogPost[];
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

const fetchBlogPosts = async (params: any): Promise<BlogResponse> => {
    const response = await apiClient.get<BlogResponse>('/blog/posts', { params });
    return response.data;
};

export default function BlogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get initial values from URL params
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState<string | null>(searchParams.get('category') || null);
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
        if (category) params.category = category;

        return params;
    }, [debouncedSearch, category, page]);

    // Fetch blog posts
    const { data, isLoading, error, isFetching } = useQuery<BlogResponse>({
        queryKey: ['blog-posts', apiParams],
        queryFn: () => fetchBlogPosts(apiParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category) params.set('category', category);
        if (page > 1) params.set('page', page.toString());

        setSearchParams(params, { replace: true });
    }, [debouncedSearch, category, page, setSearchParams]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1); // Reset to first page on new search
    };

    const handleCategoryChange = (value: string | null) => {
        setCategory(value);
        setPage(1);
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory(null);
        setPage(1);
    };

    const posts = data?.items || [];
    const pagination = data?.pagination;

    // Available categories (in production, this would come from API)
    const categories = [
        { value: null, label: 'All Categories' },
        { value: 'parenting', label: 'Parenting Tips' },
        { value: 'education', label: 'Education' },
        { value: 'stories', label: 'Stories' },
        { value: 'reviews', label: 'Reviews' },
        { value: 'news', label: 'News & Updates' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Storiofy Blog
                        </h1>
                        <p className="text-xl lg:text-2xl text-purple-100">
                            Stories, tips, and inspiration for creating magical moments
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="flex-1 w-full lg:w-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search blog posts..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-3">
                            <select
                                value={category || ''}
                                onChange={(e) => handleCategoryChange(e.target.value || null)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value || 'all'} value={cat.value || ''}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>

                            {(search || category) && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Results Count */}
                {!isLoading && pagination && (
                    <div className="mb-6 text-gray-600">
                        Showing {posts.length} of {pagination.total} posts
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-200 rounded-xl animate-pulse"
                                style={{ height: '400px' }}
                            />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">
                            Failed to load blog posts. Please try again later.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Blog Posts Grid */}
                {!isLoading && !error && (
                    <>
                        {posts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.map((post) => (
                                        <BlogPostCard
                                            key={post.id}
                                            id={post.id}
                                            slug={post.slug}
                                            title={post.title}
                                            excerpt={post.excerpt}
                                            featuredImageUrl={post.featuredImageUrl}
                                            publishedAt={post.publishedAt}
                                            author={post.author}
                                            category={post.category}
                                            readTime={post.readTime}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="mt-12 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1 || isFetching}
                                            className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 text-gray-700">
                                            Page {page} of {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                            disabled={page === pagination.totalPages || isFetching}
                                            className="px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg mb-4">
                                    No blog posts found matching your criteria.
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}




