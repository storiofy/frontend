import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import { Star, ChevronRight, Sparkles, Gift } from 'lucide-react';
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

const fetchBooks = async (params: any): Promise<BooksResponse> => {
    const response = await apiClient.get<BooksResponse>('/books', { params });
    return response.data;
};

const gifts = [
    {
        id: 101,
        title: 'Custom Story Purse',
        description: 'Featuring your child\'s favorite character',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1535556261192-f718879e7f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    }
];

export default function HomePage() {
    const { currency } = useCurrencyStore();
    const { data: bestsellersData, isLoading: isLoadingBestsellers } = useQuery<BooksResponse>({
        queryKey: ['bestsellers', { featured: 'bestseller', limit: 2, currency }],
        queryFn: () => fetchBooks({ featured: 'bestseller', limit: 2, page: 1 }),
    });

    const { data: newReleasesData, isLoading: isLoadingNewReleases } = useQuery<BooksResponse>({
        queryKey: ['newReleases', { featured: 'new', limit: 2, currency }],
        queryFn: () => fetchBooks({ featured: 'new', limit: 2, page: 1 }),
    });

    const bestsellers = bestsellersData?.items || [];
    const newReleases = newReleasesData?.items || [];

    return (
        <div className="bg-gray-50">
            <main>
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-500 via-purple-400 to-pink-400 text-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                        <div className="grid md:grid-cols-2 gap-6 items-center">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                    Create Magical Stories<br />
                                    Starring Your Child
                                </h1>
                                <p className="text-blue-50 text-base mb-4 max-w-md">
                                    Personalized AI storybooks with beautiful illustrations. Make your child the hero of their own adventure.
                                </p>

                                <div className="flex gap-6 mb-6">
                                    <div>
                                        <div className="text-2xl font-bold">50+</div>
                                        <div className="text-sm text-blue-50">Unique Stories</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">10k+</div>
                                        <div className="text-sm text-blue-50">Happy Families</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="text-2xl font-bold">4.9</div>
                                        <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                                        <div className="text-sm text-blue-50 ml-1">Rating</div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link to="/books" className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition text-sm">
                                        Browse Books
                                    </Link>
                                    <Link to="/gifts" className="border-2 border-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition text-sm">
                                        View Gifts
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative mx-auto w-64 h-80 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                                    <ImageWithFallback
                                        src="https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                                        alt="Personalized storybook"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Sparkles className="absolute top-4 right-8 w-8 h-8 text-amber-300 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bestsellers and New Releases */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Bestsellers Column */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Bestsellers</h2>
                                <Link to="/books?featured=bestseller" className="text-sm text-pink-600 hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {isLoadingBestsellers ? (
                                    Array(2).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg" />)
                                ) : (
                                    bestsellers.map((book) => (
                                        <div key={book.id} className="bg-white rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition">
                                            <Link to={`/books/${book.slug}`} className="flex-shrink-0">
                                                <ImageWithFallback
                                                    src={book.coverImageUrl}
                                                    alt={book.title}
                                                    className="w-24 h-32 object-cover rounded-lg"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <Link to={`/books/${book.slug}`}>
                                                        <h3 className="font-semibold text-sm hover:text-pink-600 transition truncate">{book.title}</h3>
                                                    </Link>
                                                    {book.discountPercentage && book.discountPercentage > 0 && (
                                                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full flex-shrink-0">
                                                            -{book.discountPercentage}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{book.shortDescription}</p>
                                                <p className="text-xs text-gray-500 mb-3">Ages {book.ageMin}-{book.ageMax}</p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-lg font-bold text-pink-600">{getCurrencySymbol(currency)}{book.finalPrice}</span>
                                                        {book.basePrice > book.finalPrice && (
                                                            <span className="text-sm text-gray-400 line-through ml-2">{getCurrencySymbol(currency)}{book.basePrice}</span>
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
                                    ))
                                )}
                            </div>
                        </div>

                        {/* New Releases Column */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">New Releases</h2>
                                <Link to="/books?featured=new" className="text-sm text-pink-600 hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {isLoadingNewReleases ? (
                                    Array(2).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg" />)
                                ) : (
                                    newReleases.map((book) => (
                                        <div key={book.id} className="bg-white rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition">
                                            <Link to={`/books/${book.slug}`} className="flex-shrink-0">
                                                <ImageWithFallback
                                                    src={book.coverImageUrl}
                                                    alt={book.title}
                                                    className="w-24 h-32 object-cover rounded-lg"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <Link to={`/books/${book.slug}`}>
                                                        <h3 className="font-semibold text-sm hover:text-pink-600 transition truncate">{book.title}</h3>
                                                    </Link>
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                                                        NEW
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{book.shortDescription}</p>
                                                <p className="text-xs text-gray-500 mb-3">Ages {book.ageMin}-{book.ageMax}</p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-lg font-bold text-pink-600">{getCurrencySymbol(currency)}{book.finalPrice}</span>
                                                        {book.basePrice > book.finalPrice && (
                                                            <span className="text-sm text-gray-400 line-through ml-2">{getCurrencySymbol(currency)}{book.basePrice}</span>
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
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Personalized Gifts */}
                <section className="bg-gradient-to-br from-pink-50 to-blue-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-3">
                                <Gift className="w-5 h-5 text-pink-500" />
                                <span className="font-semibold text-sm">Personalized Gifts</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Complete the Experience</h2>
                            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                                Matching accessories to bring your child's story to life
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {gifts.map((gift) => (
                                <div key={gift.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                    <ImageWithFallback
                                        src={gift.image}
                                        alt={gift.title}
                                        className="w-full h-40 object-cover rounded-lg mb-3"
                                    />
                                    <h3 className="font-semibold text-sm mb-1">{gift.title}</h3>
                                    <p className="text-xs text-gray-600 mb-3">{gift.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-pink-600">{getCurrencySymbol(currency)}{gift.price}</span>
                                        <button className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:from-pink-600 hover:to-blue-600 transition">
                                            Customize
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: '📚', title: 'Choose Your Story', description: 'Browse our collection of unique adventures' },
                            { icon: '✨', title: 'Personalize Details', description: 'Add child\'s name, age, photo, and preferences' },
                            { icon: '📦', title: 'Receive & Enjoy', description: 'High-quality printed book delivered to your door' }
                        ].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl mb-3">{step.icon}</div>
                                <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                                <p className="text-xs text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
