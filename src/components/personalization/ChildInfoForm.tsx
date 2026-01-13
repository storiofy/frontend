import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhotoUpload from './PhotoUpload';
import { uploadPersonalizationPhoto, updatePersonalization } from '@lib/api/personalization';

const childInfoSchema = z.object({
    childFirstName: z
        .string()
        .min(1, 'Child\'s first name is required')
        .max(25, 'Name must not exceed 25 characters'),
    childAge: z
        .number()
        .min(0, 'Age must be at least 0')
        .max(18, 'Age must be at most 18'),
    languageCode: z.string().min(1, 'Language is required'),
    childPhotoUrl: z.string().min(1, 'Photo is required'),
    gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Please select a gender' }),
    }),
});

type ChildInfoFormData = z.infer<typeof childInfoSchema>;

interface ChildInfoFormProps {
    personalizationId: string;
    initialData?: {
        childFirstName?: string;
        childAge?: number;
        languageCode?: string;
        childPhotoUrl?: string;
        gender?: 'male' | 'female' | 'other';
    };
    availableLanguages?: Array<{
        languageCode: string;
        titleTranslated: string;
        isAvailable: boolean;
    }>;
    onSubmit: (data: ChildInfoFormData) => void;
    onNext?: () => void;
}

export default function ChildInfoForm({
    personalizationId,
    initialData,
    availableLanguages = [],
    onSubmit,
    onNext,
}: ChildInfoFormProps) {
    const [_photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        initialData?.childPhotoUrl || null
    );
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid },
    } = useForm<ChildInfoFormData>({
        resolver: zodResolver(childInfoSchema),
        defaultValues: {
            childFirstName: initialData?.childFirstName || '',
            childAge: initialData?.childAge || undefined,
            languageCode: initialData?.languageCode || 'en',
            childPhotoUrl: initialData?.childPhotoUrl || '',
            gender: initialData?.gender || undefined,
        },
        mode: 'onChange',
    });

    const childFirstName = watch('childFirstName');
    const childPhotoUrl = watch('childPhotoUrl');

    // Reset form when initialData changes (e.g., when navigating back)
    useEffect(() => {
        if (initialData) {
            reset({
                childFirstName: initialData.childFirstName || '',
                childAge: initialData.childAge || undefined,
                languageCode: initialData.languageCode || 'en',
                childPhotoUrl: initialData.childPhotoUrl || '',
                gender: initialData.gender || undefined,
            });
            // Also update photo preview
            if (initialData.childPhotoUrl) {
                setPhotoPreview(initialData.childPhotoUrl);
            }
        }
    }, [initialData, reset]);

    // Update form validity when photo changes
    useEffect(() => {
        if (photoPreview) {
            setValue('childPhotoUrl', photoPreview, { shouldValidate: true });
        }
    }, [photoPreview, setValue]);

    const handlePhotoChange = async (file: File | null, preview: string | null) => {
        setPhotoFile(file);
        setPhotoPreview(preview);
        setPhotoError(null);
        setUploadProgress(0);

        if (file) {
            // If personalizationId is 'temp' (guest user), store photo locally
            if (personalizationId === 'temp') {
                // Store file in state - will be uploaded when personalization is created
                setPhotoPreview(preview);
                // Create a data URL for preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    const dataUrl = reader.result as string;
                    setValue('childPhotoUrl', dataUrl, { shouldValidate: true });
                };
                reader.readAsDataURL(file);
                return;
            }

            // For authenticated users with personalization, upload immediately
            setIsUploadingPhoto(true);
            try {
                // Simulate upload progress (in production, this would come from axios upload progress)
                const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return prev;
                        }
                        return prev + 10;
                    });
                }, 200);

                const result = await uploadPersonalizationPhoto(personalizationId, file);
                clearInterval(progressInterval);
                setUploadProgress(100);
                
                // Small delay to show 100% before hiding progress
                setTimeout(() => {
                    setPhotoPreview(result.photoUrl);
                    setValue('childPhotoUrl', result.photoUrl, { shouldValidate: true });
                    setIsUploadingPhoto(false);
                    setUploadProgress(0);
                }, 500);
            } catch (error: any) {
                setPhotoError(error.response?.data?.error || 'Failed to upload photo');
                setPhotoFile(null);
                setPhotoPreview(null);
                setIsUploadingPhoto(false);
                setUploadProgress(0);
            }
        } else {
            setValue('childPhotoUrl', '', { shouldValidate: true });
        }
    };

    const handlePhotoUrlChange = (url: string) => {
        setPhotoPreview(url);
        setValue('childPhotoUrl', url, { shouldValidate: true });
        setPhotoError(null);
    };

    const onFormSubmit = async (data: ChildInfoFormData) => {
        console.log('📝 ChildInfoForm submitting with data:', data);
        console.log('   personalizationId:', personalizationId);
        
        // Don't call update API here - the parent component (PersonalizationPage)
        // will create a NEW personalization when handleChildInfoSubmit is called
        // This ensures each personalization is unique
        console.log('📤 Passing data to parent for NEW personalization creation');
        onSubmit(data);
        if (onNext) {
            onNext();
        }
    };

    const isFormValid = isValid && childPhotoUrl && !isUploadingPhoto;

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Child Information</h2>

            {/* Photo Upload Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Photo <span className="text-red-500">*</span>
                </label>
                <PhotoUpload
                    photoUrl={photoPreview || undefined}
                    onPhotoChange={handlePhotoChange}
                    onPhotoUrlChange={handlePhotoUrlChange}
                    error={photoError || errors.childPhotoUrl?.message}
                    uploadProgress={uploadProgress}
                    isUploading={isUploadingPhoto}
                />
            </div>

            {/* Language Selection */}
            <div>
                <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Language <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('languageCode')}
                    id="language"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    {availableLanguages.length > 0 ? (
                        availableLanguages.map((lang) => (
                            <option
                                key={lang.languageCode}
                                value={lang.languageCode}
                                disabled={!lang.isAvailable}
                            >
                                {lang.titleTranslated || lang.languageCode.toUpperCase()}
                                {!lang.isAvailable && ' (Coming Soon)'}
                            </option>
                        ))
                    ) : (
                        <>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </>
                    )}
                </select>
                {errors.languageCode && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.languageCode.message}
                    </p>
                )}
            </div>

            {/* Child's First Name */}
            <div>
                <label
                    htmlFor="childFirstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Child's First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        {...register('childFirstName')}
                        type="text"
                        id="childFirstName"
                        maxLength={25}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter child's first name"
                    />
                    <div className="absolute right-3 top-2 text-xs text-gray-500">
                        {childFirstName?.length || 0}/25
                    </div>
                </div>
                {errors.childFirstName && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.childFirstName.message}
                    </p>
                )}
            </div>

            {/* Child's Age */}
            <div>
                <label
                    htmlFor="childAge"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Child's Age <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('childAge', { valueAsNumber: true })}
                    type="number"
                    id="childAge"
                    min="0"
                    max="18"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter child's age"
                />
                {errors.childAge && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.childAge.message}
                    </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    Age must be between 0 and 18 years
                </p>
            </div>

            {/* Gender Selection */}
            <div>
                <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Gender <span className="text-red-500">*</span>
                </label>
                <select
                    {...register('gender')}
                    id="gender"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.gender.message}
                    </p>
                )}
            </div>

            {/* Preview Book Button */}
            <div className="pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    disabled={!isFormValid || isUploadingPhoto}
                    className={`
                        w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold text-center
                        transition-all duration-200
                        ${
                            isFormValid && !isUploadingPhoto
                                ? 'hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                : 'opacity-50 cursor-not-allowed'
                        }
                    `}
                >
                    {isUploadingPhoto
                        ? 'Uploading Photo...'
                        : isFormValid
                        ? 'Preview Book'
                        : 'Please complete all fields'}
                </button>
            </div>
        </form>
    );
}

