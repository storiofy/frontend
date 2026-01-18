import { useState } from 'react';
import { Link } from 'react-router-dom';

interface BookDetailsProps {
    slug: string;
    title: string;
    description: string;
    shortDescription?: string;
    ageMin: number;
    ageMax: number;
    idealFor: string;
    genre?: string;
    pageCount: number;
    basePrice: number;
    discountPercentage?: number;
    finalPrice: number;
    languageCode: string;
    availableLanguages?: Array<{
        languageCode: string;
        titleTranslated: string;
        isAvailable: boolean;
    }>;
    specifications?: {
        idealFor: string;
        ageRange: string;
        characters: string;
        genre: string;
        pages: string;
        shipping: string[];
    };
    rating?: number;
    reviewCount?: number;
}

export default function BookDetails({
    slug,
    title,
    description,
    shortDescription,
    ageMin,
    ageMax,
    idealFor: _idealFor,
    genre: _genre,
    pageCount,
    basePrice,
    discountPercentage,
    finalPrice,
    languageCode,
    availableLanguages = [],
    specifications,
    rating = 4.8,
    reviewCount = 0,
}: BookDetailsProps) {
    const [selectedLanguage, setSelectedLanguage] = useState(languageCode);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

    // Build features list based on book data
    const features = [
        `For children ${ageMin}-${ageMax} years`,
        `Personalized with the child's name`,
        `Personalized with the child's gender`,
        `Features ${pageCount || 20} heartwarming stories`,
        `High-quality, personalized and printed`,
    ];

    return (
        <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{title}</h1>

            {/* Description */}
            <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{description}</p>
                {shortDescription && (
                    <p className="text-gray-600">{shortDescription}</p>
                )}
            </div>

            {/* Key Features */}
            <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Key Features</span>
                </h3>
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <svg
                                className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-gray-700 leading-relaxed font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 py-4">
                {discountPercentage && discountPercentage > 0 ? (
                    <>
                        <span className="text-4xl font-bold text-indigo-600">
                            ${finalPrice.toFixed(2)}
                        </span>
                        <span className="text-xl text-gray-400 line-through">
                            ${basePrice.toFixed(2)}
                        </span>
                        {discountPercentage > 0 && (
                            <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-bold rounded-lg border border-green-200">
                                Save ${(basePrice - finalPrice).toFixed(2)}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-4xl font-bold text-indigo-600">
                        ${basePrice.toFixed(2)}
                    </span>
                )}
            </div>

            {/* Specifications Grid */}
            <div className="border-2 border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Specifications</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-xs uppercase tracking-wide">Size</span>
                            <span className="text-gray-700 font-semibold">8.5 x 11 inches</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-xs uppercase tracking-wide">Pages</span>
                            <span className="text-gray-700 font-semibold">
                                {specifications?.pages || `${pageCount || 30}-${pageCount + 10 || 40}`}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-xs uppercase tracking-wide">Cover</span>
                            <span className="text-gray-700 font-semibold">Hardcover</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-xs uppercase tracking-wide">Shipping</span>
                            <span className="text-gray-700 font-semibold">Worldwide</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Selector */}
            {availableLanguages.length > 0 && (
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span>Choose Language</span>
                    </label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold text-gray-900 bg-white"
                    >
                        {availableLanguages.map((lang) => (
                            <option
                                key={lang.languageCode}
                                value={lang.languageCode}
                                disabled={!lang.isAvailable}
                            >
                                {lang.titleTranslated || lang.languageCode.toUpperCase()}
                                {!lang.isAvailable && ' (Coming Soon)'}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Personalise Button */}
            <Link
                to={`/books/${slug}/personalise?language=${selectedLanguage}`}
                className="block w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-5 px-6 rounded-xl font-bold text-center text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
                ✨ Start Personalizing Now
            </Link>

            {/* Accordion FAQs */}
            <div className="space-y-0 border-t-2 border-gray-200 pt-6 mt-6">
                <button
                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                    className="w-full text-left flex items-center justify-between py-4 px-0 text-gray-900 hover:text-indigo-600 transition-colors border-b border-gray-200 group"
                >
                    <span className="font-bold flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        What if I need help personalizing?
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform flex-shrink-0 text-indigo-600 ${isHelpOpen ? 'transform rotate-180' : ''
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
                {isHelpOpen && (
                    <div className="pb-4 pt-2 text-gray-600 leading-relaxed bg-indigo-50 px-4 py-3 rounded-xl mt-2">
                        Our customer support team is here to help! Contact us via email at
                        support@Storiofy.com or use the chat widget on our website. We're
                        available 24/7 to assist you with the personalization process.
                    </div>
                )}

                <button
                    onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                    className="w-full text-left flex items-center justify-between py-4 px-0 text-gray-900 hover:text-indigo-600 transition-colors border-b border-gray-200 group"
                >
                    <span className="font-bold flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Can I see a preview before I buy?
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform flex-shrink-0 text-indigo-600 ${isPreviewOpen ? 'transform rotate-180' : ''
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
                {isPreviewOpen && (
                    <div className="pb-4 pt-2 text-gray-600 leading-relaxed bg-indigo-50 px-4 py-3 rounded-xl mt-2">
                        Yes! After you personalize the book with your child's name, photo, and
                        details, you'll be able to preview the entire book before purchasing. You
                        can review all pages and make any adjustments before finalizing your order.
                    </div>
                )}

                <button
                    onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                    className="w-full text-left flex items-center justify-between py-4 px-0 text-gray-900 hover:text-indigo-600 transition-colors border-b border-gray-200 group"
                >
                    <span className="font-bold flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        Delivery, returns, and exchanges
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform flex-shrink-0 text-indigo-600 ${isDeliveryOpen ? 'transform rotate-180' : ''
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
                {isDeliveryOpen && (
                    <div className="pb-4 pt-2 text-gray-600 leading-relaxed bg-indigo-50 px-4 py-3 rounded-xl mt-2 space-y-2">
                        <p className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span><strong>Shipping:</strong> We ship worldwide! Standard shipping takes 7-14 business days, while express shipping takes 3-7 business days.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span><strong>Returns:</strong> We offer a 30-day return policy for items in original condition.</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span><strong>Exchanges:</strong> For exchanges, please contact our customer service team at support@Storiofy.com.</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Rating Display */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(rating)
                                ? 'text-yellow-400'
                                : i < rating
                                    ? 'text-yellow-300'
                                    : 'text-gray-300'
                                }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold">
                        {rating.toFixed(1)} out of 5
                    </span>
                    {reviewCount > 0 && (
                        <span className="text-sm text-gray-500">
                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

