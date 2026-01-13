import { useState, useRef } from 'react';

interface PhotoUploadProps {
    photoUrl?: string;
    onPhotoChange: (file: File | null, previewUrl: string | null) => void;
    onPhotoUrlChange?: (url: string) => void;
    error?: string;
    uploadProgress?: number; // 0-100
    isUploading?: boolean;
}

export default function PhotoUpload({
    photoUrl,
    onPhotoChange,
    onPhotoUrlChange,
    error,
    uploadProgress = 0,
    isUploading = false,
}: PhotoUploadProps) {
    const [preview, setPreview] = useState<string | null>(photoUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        setValidationError(null);

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!file.type.startsWith('image/') || !allowedTypes.includes(file.type.toLowerCase())) {
            setValidationError('Please select a valid image file (JPG, PNG, or WEBP)');
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setValidationError(`File size must not exceed 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
            return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        onPhotoChange(file, previewUrl);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemovePhoto = () => {
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        onPhotoChange(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        if (url && onPhotoUrlChange) {
            onPhotoUrlChange(url);
            setPreview(url);
        }
    };

    return (
        <div className="space-y-4">
            {/* Photo Upload Area */}
            <div
                className={`
                    relative border-2 border-dashed rounded-xl p-6 transition-colors
                    ${
                        isDragging
                            ? 'border-indigo-500 bg-indigo-50'
                            : error
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-gray-50 hover:border-indigo-400'
                    }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative">
                        <img
                            src={preview}
                            alt="Child photo preview"
                            className="w-full h-64 object-cover rounded-xl"
                        />
                        {/* Upload Progress Overlay */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                                <div className="bg-white rounded-xl p-4 w-3/4 max-w-xs">
                                    <div className="mb-2 text-sm font-medium text-gray-700 text-center">
                                        Uploading photo...
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 text-center">
                                        {uploadProgress}%
                                    </div>
                                </div>
                            </div>
                        )}
                        {!isUploading && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                                aria-label="Remove photo"
                            >
                                <svg
                                    className="w-5 h-5"
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
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <div className="mt-4">
                            <label
                                htmlFor="photo-upload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Upload Photo
                            </label>
                            <input
                                ref={fileInputRef}
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileInputChange}
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            or drag and drop
                        </p>
                    </div>
                )}
            </div>

            {/* Photo URL Input (Alternative) */}
            <div>
                <label htmlFor="photo-url" className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter photo URL
                </label>
                <input
                    id="photo-url"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    onChange={handleUrlInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Photo Tips Section */}
            <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">Photo Tips:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Suitable Examples */}
                        <div>
                            <h5 className="text-xs font-semibold text-green-700 mb-2 flex items-center">
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Suitable Photos
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                                <li>Clear, front-facing photo</li>
                                <li>Good lighting (natural light preferred)</li>
                                <li>Face clearly visible</li>
                                <li>Neutral background</li>
                                <li>High resolution (at least 500x500px)</li>
                            </ul>
                        </div>

                        {/* Unsuitable Examples */}
                        <div>
                            <h5 className="text-xs font-semibold text-red-700 mb-2 flex items-center">
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Avoid These
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                                <li>Side profile or back view</li>
                                <li>Dark or poor lighting</li>
                                <li>Face partially hidden</li>
                                <li>Busy or distracting background</li>
                                <li>Low resolution or blurry images</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs text-blue-700">
                            <strong>Supported formats:</strong> JPG, PNG, WEBP (max 10MB)
                        </p>
                    </div>
                </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-sm text-red-700">{validationError}</p>
                    </div>
                </div>
            )}

            {/* API Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-start">
                        <svg
                            className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

