import { useState, useEffect } from 'react';

interface BookImageGalleryProps {
    coverImageUrl: string;
    previewVideoUrl?: string;
    images?: Array<{
        id: string;
        imageUrl: string;
        imageType: string;
        displayOrder: number;
        altText?: string;
    }>;
}

export default function BookImageGallery({
    coverImageUrl,
    previewVideoUrl,
    images = [],
}: BookImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(coverImageUrl);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Combine all images: cover, video thumbnail, and additional images
    const allImages = [
        { url: coverImageUrl, type: 'cover', id: 'cover' },
        ...(previewVideoUrl ? [{ url: previewVideoUrl, type: 'video', id: 'video' }] : []),
        ...images
            .filter((img) => img.imageUrl !== coverImageUrl)
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((img) => ({
                url: img.imageUrl,
                type: img.imageType,
                id: img.id,
            })),
    ];

    // Update selected image index when selectedImage changes
    useEffect(() => {
        const index = allImages.findIndex((img) => img.url === selectedImage);
        if (index !== -1) {
            setSelectedImageIndex(index);
        }
    }, [selectedImage, allImages]);

    const handleThumbnailClick = (url: string, index: number) => {
        setSelectedImage(url);
        setSelectedImageIndex(index);
    };

    const handleMainImageClick = () => {
        setIsLightboxOpen(true);
    };

    const handleLightboxClose = () => {
        setIsLightboxOpen(false);
    };

    const handleLightboxPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        const prevIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1;
        setSelectedImageIndex(prevIndex);
        setSelectedImage(allImages[prevIndex].url);
    };

    const handleLightboxNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextIndex = selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0;
        setSelectedImageIndex(nextIndex);
        setSelectedImage(allImages[nextIndex].url);
    };

    // Close lightbox on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isLightboxOpen) {
                setIsLightboxOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isLightboxOpen]);

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Thumbnail Gallery (Vertical on desktop, horizontal on mobile) */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                    {allImages.slice(0, 5).map((img, index) => (
                        <button
                            key={img.id || index}
                            onClick={() => handleThumbnailClick(img.url, index)}
                            className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url
                                    ? 'border-indigo-600 ring-2 ring-indigo-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            aria-label={`View ${img.type || 'image'} ${index + 1}`}
                        >
                            {img.type === 'video' ? (
                                <div className="relative w-full h-full bg-gray-100 flex items-center justify-center">
                                    <img
                                        src={img.url}
                                        alt="Video preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={img.url}
                                    alt={img.type || 'Book image'}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="flex-1">
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg overflow-hidden cursor-zoom-in group">
                        {selectedImage && (
                            <>
                                <img
                                    src={selectedImage}
                                    alt="Book cover"
                                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                                    onClick={handleMainImageClick}
                                />
                                {/* Zoom indicator */}
                                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to enlarge
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                    onClick={handleLightboxClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleLightboxClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                        aria-label="Close lightbox"
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Previous Button */}
                    {allImages.length > 1 && (
                        <button
                            onClick={handleLightboxPrevious}
                            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                            aria-label="Previous image"
                        >
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    )}

                    {/* Main Image in Lightbox */}
                    <div
                        className="relative max-w-4xl max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {allImages[selectedImageIndex]?.type === 'video' ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={allImages[selectedImageIndex].url}
                                    alt="Video preview"
                                    className="max-w-full max-h-[90vh] object-contain"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="bg-white bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-opacity">
                                        <svg
                                            className="w-16 h-16 text-indigo-600"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={allImages[selectedImageIndex]?.url}
                                alt="Book image"
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                        )}
                    </div>

                    {/* Next Button */}
                    {allImages.length > 1 && (
                        <button
                            onClick={handleLightboxNext}
                            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                            aria-label="Next image"
                        >
                            <svg
                                className="w-8 h-8"
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
                        </button>
                    )}

                    {/* Image Counter */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                            {selectedImageIndex + 1} / {allImages.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

