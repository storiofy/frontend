import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import { Star, Package, Truck, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '@components/figma/ImageWithFallback';
import { useCurrencyStore } from '@store/currencyStore';
import { getCurrencySymbol } from '@lib/utils/currency';

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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [showFAQs, setShowFAQs] = useState(false);
    const { currency } = useCurrencyStore();

    const { data: book, isLoading, error } = useQuery<BookDetailResponse>({
        queryKey: ['book', slug, currency],
        queryFn: () => fetchBookBySlug(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });

    // Initialize defaults when data is loaded
    if (book && !selectedImage) setSelectedImage(book.coverImageUrl);
    if (book && !selectedLanguage) setSelectedLanguage(book.languageCode);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Book Not Found</h2>
                <Link to="/books" className="text-pink-600 hover:underline">Back to Books</Link>
            </div>
        );
    }

    const allImages = [
        { url: book.coverImageUrl, type: 'cover' },
        ...book.images.map(img => ({ url: img.imageUrl, type: img.imageType }))
    ].filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

    const features = [
        `For children ${book.ageMin}-${book.ageMax} years`,
        `Personalized with the child's name`,
        `Features ${book.pageCount} heartwarming stories`,
        `High-quality printed book`
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Image Gallery */}
                    <div>
                        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                            <ImageWithFallback
                                src={selectedImage || book.coverImageUrl}
                                alt={book.title}
                                className="w-full aspect-[2/4] object-contain rounded-xl"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {allImages.slice(0, 4).map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img.url)}
                                    className={`border-2 rounded-xl overflow-hidden transition-all ${selectedImage === img.url ? 'border-pink-500 ring-2 ring-pink-100' : 'border-gray-200 hover:border-pink-200'}`}
                                >
                                    <ImageWithFallback
                                        src={img.url}
                                        alt={`${book.title} ${index + 1}`}
                                        className="w-full aspect-square object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-pink-600 font-semibold text-sm">
                                <Sparkles className="w-4 h-4" />
                                <span>Personalized Storybook</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">{book.title}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <span className="font-bold text-sm">4.9</span>
                                <span className="text-gray-400 text-xs">(128 reviews)</span>
                            </div>

                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                {book.shortDescription || book.description}
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {features.map((feature, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            {/* Specs Grid */}
                            <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-4 mb-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Ages</p>
                                        <p className="text-xs font-bold">{book.ageMin}-{book.ageMax}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Pages</p>
                                        <p className="text-xs font-bold">{book.pageCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Cover</p>
                                        <p className="text-xs font-bold">Hardcover</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Ships</p>
                                        <p className="text-xs font-bold">Worldwide</p>
                                    </div>
                                </div>
                            </div>

                            {/* Language Selector */}
                            {book.languages.length > 0 && (
                                <div className="mb-6">
                                    <label className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-wide">Select Language</label>
                                    <select
                                        value={selectedLanguage || ''}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    >
                                        {book.languages.map(lang => (
                                            <option key={lang.languageCode} value={lang.languageCode} disabled={!lang.isAvailable}>
                                                {lang.titleTranslated} {!lang.isAvailable && '(Soon)'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Price and CTA */}
                            <div className="border-t pt-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl font-bold text-pink-600">{getCurrencySymbol(currency)}{book.finalPrice}</span>
                                    {book.basePrice > book.finalPrice && (
                                        <span className="text-xl text-gray-400 line-through">{getCurrencySymbol(currency)}{book.basePrice}</span>
                                    )}
                                    {book.discountPercentage && (
                                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">
                                            SAVE {book.discountPercentage}%
                                        </span>
                                    )}
                                </div>
                                <Link
                                    to={`/books/${slug}/personalise?language=${selectedLanguage}`}
                                    className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-100"
                                >
                                    <span>Start Personalizing Now</span>
                                </Link>
                                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                                    <RotateCcw className="w-3 h-3" />
                                    <span>30-day money-back guarantee</span>
                                </p>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                <Package className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                                <p className="text-[10px] font-bold text-gray-700">Premium Quality</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                <Truck className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <p className="text-[10px] font-bold text-gray-700">Free Shipping</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                <RotateCcw className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                                <p className="text-[10px] font-bold text-gray-700">Easy Returns</p>
                            </div>
                        </div>

                        {/* Collapsible FAQ */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                            <button
                                onClick={() => setShowFAQs(!showFAQs)}
                                className="w-full flex items-center justify-between text-sm font-bold text-gray-900"
                            >
                                <span>Product Information & FAQs</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFAQs ? 'rotate-180' : ''}`} />
                            </button>
                            {showFAQs && (
                                <div className="mt-4 space-y-4 text-xs text-gray-600 leading-relaxed border-t pt-4">
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">What can I personalize?</p>
                                        <p>You can customize the story with your child's name, gender, physical appearance, and even write a special dedication message.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">Can I see a preview?</p>
                                        <p>Absolutely! After you finish the personalization steps, we'll show you a full digital preview of every page in your book.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

