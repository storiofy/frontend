import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '@lib/api/client';
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

const fetchBestsellers = async (): Promise<BooksResponse> => {
    const response = await apiClient.get<BooksResponse>('/books', {
        params: {
            featured: 'bestseller',
            limit: 6,
            page: 1,
        },
    });
    return response.data;
};

export default function BestsellersSection() {
    const { data, isLoading, error } = useQuery<BooksResponse>({
        queryKey: ['bestsellers'],
        queryFn: fetchBestsellers,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    if (isLoading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            BESTSELLERS
                        </h2>
                        <p className="text-lg text-gray-600">
                            Personalise a bestseller
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-200 rounded-xl animate-pulse"
                                style={{ height: '500px' }}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-red-600">
                            Failed to load bestsellers. Please try again later.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const books = data?.items || [];

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        BESTSELLERS
                    </h2>
                    <p className="text-base text-gray-600">
                        Personalise a bestseller
                    </p>
                </div>

                {/* Product Grid */}
                {books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
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
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600">
                            No bestseller books available at the moment.
                        </p>
                    </div>
                )}

                {/* View All Button */}
                {books.length > 0 && (
                    <div className="text-center">
                        <Link
                            to="/books?featured=bestseller"
                            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm"
                        >
                            View All
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}




