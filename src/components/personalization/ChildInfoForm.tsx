import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhotoUpload from './PhotoUpload';
import { uploadPersonalizationPhoto } from '@lib/api/personalization';

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
        message: 'Please select a gender',
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
    onChange?: (data: Partial<ChildInfoFormData>) => void;
    onNext?: () => void;
}

export default function ChildInfoForm({
    personalizationId,
    initialData,
    onSubmit,
    onChange,
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
            childAge: initialData?.childAge || 5,
            languageCode: 'en',
            childPhotoUrl: initialData?.childPhotoUrl || '',
            gender: initialData?.gender || undefined,
        },
        mode: 'onChange',
    });

    const childFirstName = watch('childFirstName');
    const childAge = watch('childAge');
    const childPhotoUrl = watch('childPhotoUrl');
    const selectedGender = watch('gender');

    // Notify parent of changes for real-time preview
    useEffect(() => {
        if (onChange) {
            onChange({
                childFirstName,
                childAge,
                childPhotoUrl,
                gender: selectedGender,
                languageCode: 'en'
            });
        }
    }, [childFirstName, childAge, childPhotoUrl, selectedGender, onChange]);

    // Reset form only when personalizationId changes or when initialData is first loaded
    // This prevents the loop when parent's formData (synced via onChange) comes back as initialData
    useEffect(() => {
        if (initialData) {
            // We only want to reset the form if it's the first time we're getting data
            // or if the underlying personalization record has changed.
            // If we're just updating fields, the form's internal state is fine.
            reset(prev => ({
                ...prev,
                childFirstName: initialData.childFirstName ?? prev.childFirstName,
                childAge: initialData.childAge ?? prev.childAge,
                childPhotoUrl: initialData.childPhotoUrl ?? prev.childPhotoUrl,
                gender: initialData.gender ?? prev.gender,
            }), { keepDefaultValues: true });

            if (initialData.childPhotoUrl) {
                setPhotoPreview(initialData.childPhotoUrl);
            }
        }
    }, [personalizationId, reset]); // Removed initialData from dependencies to stop the loop

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
            if (personalizationId === 'temp') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const dataUrl = reader.result as string;
                    setValue('childPhotoUrl', dataUrl, { shouldValidate: true });
                };
                reader.readAsDataURL(file);
                return;
            }

            setIsUploadingPhoto(true);
            try {
                const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => (prev >= 90 ? prev : prev + 10));
                }, 200);

                const result = await uploadPersonalizationPhoto(personalizationId, file);
                clearInterval(progressInterval);
                setUploadProgress(100);

                setTimeout(() => {
                    setPhotoPreview(result.photoUrl);
                    setValue('childPhotoUrl', result.photoUrl, { shouldValidate: true });
                    setIsUploadingPhoto(false);
                    setUploadProgress(0);
                }, 500);
            } catch (error: any) {
                setPhotoError(error.response?.data?.error || 'Failed to upload photo');
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
        onSubmit(data);
        if (onNext) onNext();
    };

    const isFormValid = isValid && childPhotoUrl && !isUploadingPhoto;

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl border border-white/40">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Personalize <span className="text-vibrant-brand">Your Story</span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Let's make your child the hero of the adventure!</p>
                    </div>

                    {/* Child's First Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex justify-between">
                            <span>Child's First Name</span>
                            <span className="text-xs font-medium lowercase text-gray-400">{childFirstName?.length || 0}/25</span>
                        </label>
                        <input
                            {...register('childFirstName')}
                            type="text"
                            maxLength={25}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-base font-medium"
                            placeholder="e.g. Charlie"
                        />
                        {errors.childFirstName && <p className="text-xs text-red-600 font-medium px-2">{errors.childFirstName.message}</p>}
                    </div>

                    {/* Gender Selection - Custom Buttons */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Gender Identity</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'male', label: 'Boy', icon: '👦' },
                                { id: 'female', label: 'Girl', icon: '👧' },
                                { id: 'other', label: 'Both/Neutral', icon: '🧒' }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setValue('gender', option.id as any, { shouldValidate: true })}
                                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 ${selectedGender === option.id
                                        ? 'bg-indigo-50 border-indigo-600 shadow-md ring-4 ring-indigo-500/10 scale-105'
                                        : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30'
                                        }`}
                                >
                                    <span className="text-xl">{option.icon}</span>
                                    <span className={`text-xs font-bold ${selectedGender === option.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {errors.gender && <p className="text-xs text-red-600 font-medium px-2">{errors.gender.message}</p>}
                    </div>

                    {/* Age Section - Slider + Input */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Child's Age</label>
                            <div className="flex items-center gap-2 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                <input
                                    type="number"
                                    value={childAge}
                                    onChange={(e) => setValue('childAge', Math.min(18, Math.max(0, parseInt(e.target.value) || 0)), { shouldValidate: true })}
                                    className="w-10 bg-transparent text-center font-extrabold text-indigo-600 outline-none text-base"
                                />
                                <span className="text-[10px] font-bold text-indigo-400 uppercase">Years</span>
                            </div>
                        </div>
                        <div className="px-1">
                            <input
                                type="range"
                                min="0"
                                max="18"
                                step="1"
                                value={childAge || 0}
                                onChange={(e) => setValue('childAge', parseInt(e.target.value), { shouldValidate: true })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                            />
                        </div>
                        {errors.childAge && <p className="text-xs text-red-600 font-medium px-2">{errors.childAge.message}</p>}
                    </div>

                    {/* Photo Upload Section - Now at the bottom */}
                    <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Upload Photo <span className="text-[10px] font-normal text-gray-400 ml-1">(to appear in the book)</span>
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

                    {/* Submit Section */}
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={!isFormValid || isUploadingPhoto}
                            className={`w-full py-4 rounded-xl font-extrabold text-lg shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${isFormValid && !isUploadingPhoto
                                ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed grayscale'
                                }`}
                        >
                            {isUploadingPhoto ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-white" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <span>Preview Your Magic Book</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

