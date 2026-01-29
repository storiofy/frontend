import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import BlogPostCard from '@components/blog/BlogPostCard';
import { Search, Sparkles, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@components/layout/Logo';

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

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const fetchBlogPosts = async (params: any): Promise<BlogResponse> => {
    const response = await apiClient.get<BlogResponse>('/blog/posts', { params });
    return response.data;
};

export default function BlogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState<string | null>(searchParams.get('category') || null);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
    const debouncedSearch = useDebounce(search, 300);

    const apiParams = useMemo(() => {
        const params: any = { page, limit: 12 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (category) params.category = category;
        return params;
    }, [debouncedSearch, category, page]);

    const { data, isLoading } = useQuery<BlogResponse>({
        queryKey: ['blog-posts', apiParams],
        queryFn: () => fetchBlogPosts(apiParams),
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category) params.set('category', category);
        if (page > 1) params.set('page', page.toString());
        setSearchParams(params, { replace: true });
    }, [debouncedSearch, category, page, setSearchParams]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
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

    const categories = [
        { value: null, label: 'All Stories' },
        { value: 'parenting', label: 'Parenting' },
        { value: 'education', label: 'Magic Learning' },
        { value: 'stories', label: 'Wonder Tales' },
        { value: 'lifestyle', label: 'Lifestyle' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Hero */}
                <div className="text-center mb-16 space-y-4">
                    <Link to="/" className="inline-flex items-center gap-2 justify-center mb-8 group">
                        <Logo />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-tighter">Storiofy</span>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-pink-500 mb-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Enchanted Journal</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl font-black text-gray-900 tracking-tighter leading-none"
                    >
                        Storiofy <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Insights</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-bold text-gray-400 max-w-2xl mx-auto"
                    >
                        Stories behind the stories. Discover inspiration, parenting tips, and the magic of personalization.
                    </motion.p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-4 md:p-6 mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">
                        <div className="flex-1 w-full relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-pink-500 transition-colors" />
                            <input
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full h-14 pl-16 pr-8 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-pink-500 focus:bg-white transition-all outline-none font-bold text-gray-900"
                                placeholder="Search the magic archives..."
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full lg:w-auto scrollbar-hide">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleCategoryChange(cat.value)}
                                    className={`h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${category === cat.value
                                        ? 'bg-gray-900 text-white shadow-lg'
                                        : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-gray-200'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Blog Grid */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-[2.5rem] p-4 border border-gray-100 space-y-6 animate-pulse">
                                    <div className="aspect-[4/3] bg-gray-100 rounded-[2rem]"></div>
                                    <div className="px-4 space-y-4 pb-4">
                                        <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                                        <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-12"
                        >
                            {posts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {posts.map((post, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={post.id}
                                        >
                                            <BlogPostCard {...post} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <BookOpen className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase">Archive Empty</h3>
                                    <p className="text-gray-400 font-bold mt-2">No tales match your current search.</p>
                                    <button onClick={handleClearFilters} className="mt-8 text-[10px] font-black uppercase text-pink-500 underline">Clear search</button>
                                </div>
                            )}

                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 pt-8">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="h-12 w-12 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-200 hover:text-gray-900 disabled:opacity-30 transition"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-900">Page {page} of {pagination.totalPages}</span>
                                    <button
                                        disabled={page === pagination.totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="h-12 w-12 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-200 hover:text-gray-900 disabled:opacity-30 transition"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
