import { Link } from 'react-router-dom';

interface ProductCardProps {
    id: string;
    slug: string;
    title: string;
    shortDescription?: string;
    coverImageUrl: string;
    discountPercentage?: number;
    ageMin: number;
    ageMax: number;
    basePrice: number;
    finalPrice: number;
    isNew?: boolean;
    productType?: 'book';
}

export default function ProductCard({
    id: _id,
    slug,
    title,
    shortDescription,
    coverImageUrl,
    discountPercentage,
    ageMin,
    ageMax,
    basePrice,
    finalPrice,
    isNew = false,
    productType: _productType = 'book',
}: ProductCardProps) {
    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 hover:border-indigo-200">
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Cover Image */}
                <img
                    src={coverImageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {discountPercentage && discountPercentage > 0 && (
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            -{discountPercentage}% OFF
                        </div>
                    )}
                    {isNew && (
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            NEW
                        </div>
                    )}
                </div>

                {/* Quick View Button (appears on hover) */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Link
                        to={`/books/${slug}`}
                        className="w-full bg-white/95 backdrop-blur-sm text-indigo-600 py-2.5 px-4 rounded-xl font-semibold text-sm text-center hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Details</span>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col">
                {/* Title */}
                <Link
                    to={`/books/${slug}`}
                    className="group/title"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover/title:text-indigo-600 transition-colors leading-snug">
                        {title}
                    </h3>
                </Link>

                {/* Description */}
                {shortDescription && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow leading-relaxed">
                        {shortDescription}
                    </p>
                )}

                {/* Age Range */}
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1.5 rounded-lg">
                        <svg
                            className="w-4 h-4 text-indigo-600"
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
                        <span className="text-xs font-semibold text-indigo-700">
                            Ages {ageMin}-{ageMax}
                        </span>
                    </div>
                </div>

                {/* Price and Button */}
                <div className="mt-auto">
                    {/* Price */}
                    <div className="mb-3">
                        {discountPercentage && discountPercentage > 0 ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-indigo-600">
                                    ${finalPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    ${basePrice.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-gray-900">
                                ${basePrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Personalize Button */}
                    <Link
                        to={`/books/${slug}`}
                        className="block w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 rounded-xl font-bold text-center hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
                    >
                        Personalize Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
