import { Link } from 'react-router-dom';

interface BlogPostCardProps {
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

export default function BlogPostCard({
    id: _id,
    slug,
    title,
    excerpt,
    featuredImageUrl,
    publishedAt,
    author,
    category,
    readTime,
}: BlogPostCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Link
            to={`/blog/${slug}`}
            className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            {/* Featured Image */}
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                <img
                    src={featuredImageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {category && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Date and Author */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span>{formatDate(publishedAt)}</span>
                    {author && (
                        <>
                            <span className="mx-2">•</span>
                            <span>{author}</span>
                        </>
                    )}
                    {readTime && (
                        <>
                            <span className="mx-2">•</span>
                            <span>{readTime} min read</span>
                        </>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 line-clamp-3 mb-4">
                    {excerpt}
                </p>

                {/* Read More Link */}
                <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors">
                    <span>Read More</span>
                    <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </Link>
    );
}




