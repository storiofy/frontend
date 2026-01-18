import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import BookImageGallery from '@components/book/BookImageGallery';
import BookDetails from '@components/book/BookDetails';

interface BookDetailResponse {
    id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription?: string;
    coverImageUrl: string;
    previewVideoUrl?: string;
    idealFor: string;
    ageMin: number;
    ageMax: number;
    genre?: string;
    pageCount: number;
    basePrice: number;
    discountPercentage?: number;
    finalPrice: number;
    languageCode: string;
    images: Array<{
        id: string;
        imageUrl: string;
        imageType: string;
        displayOrder: number;
        altText?: string;
    }>;
    languages: Array<{
        languageCode: string;
        titleTranslated: string;
        isAvailable: boolean;
    }>;
    specifications: {
        idealFor: string;
        ageRange: string;
        characters: string;
        genre: string;
        pages: string;
        shipping: string[];
    };
}

const fetchBookBySlug = async (slug: string): Promise<BookDetailResponse> => {
    const response = await apiClient.get<BookDetailResponse>(`/books/${slug}`);
    return response.data;
};

export default function BookDetailPage() {
    const { slug } = useParams<{ slug: string }>();

    const { data: book, isLoading, error } = useQuery<BookDetailResponse>({
        queryKey: ['book', slug],
        queryFn: () => fetchBookBySlug(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Loading Skeleton - Left */}
                        <div className="space-y-4">
                            <div className="bg-gray-200 rounded-2xl animate-pulse" style={{ height: '600px' }} />
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="bg-gray-200 rounded-xl animate-pulse h-20" />
                                ))}
                            </div>
                        </div>
                        {/* Loading Skeleton - Right */}
                        <div className="space-y-6">
                            <div className="bg-gray-200 rounded-xl animate-pulse h-10" style={{ width: '70%' }} />
                            <div className="bg-gray-200 rounded-xl animate-pulse h-8" style={{ width: '40%' }} />
                            <div className="space-y-2">
                                <div className="bg-gray-200 rounded-xl animate-pulse h-4" />
                                <div className="bg-gray-200 rounded-xl animate-pulse h-4" />
                                <div className="bg-gray-200 rounded-xl animate-pulse h-4" style={{ width: '80%' }} />
                            </div>
                            <div className="bg-gray-200 rounded-2xl animate-pulse h-24" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Book Not Found</h2>
                    <p className="text-gray-600 mb-8">
                        The book you're looking for doesn't exist or has been removed.
                    </p>
                    <a
                        href="/books"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Browse All Books</span>
                    </a>
                </div>
            </div>
        );
    }

    if (!book) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Image Gallery (35-40%) */}
                    <div className="lg:w-full">
                        <BookImageGallery
                            coverImageUrl={book.coverImageUrl}
                            previewVideoUrl={book.previewVideoUrl}
                            images={book.images}
                        />
                    </div>

                    {/* Right Column - Product Details (60-65%) */}
                    <div className="lg:w-full">
                        <BookDetails
                            slug={book.slug}
                            title={book.title}
                            description={book.description}
                            shortDescription={book.shortDescription}
                            ageMin={book.ageMin}
                            ageMax={book.ageMax}
                            idealFor={book.idealFor}
                            genre={book.genre}
                            pageCount={book.pageCount}
                            basePrice={book.basePrice}
                            discountPercentage={book.discountPercentage}
                            finalPrice={book.finalPrice}
                            languageCode={book.languageCode}
                            availableLanguages={book.languages}
                            specifications={book.specifications}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

