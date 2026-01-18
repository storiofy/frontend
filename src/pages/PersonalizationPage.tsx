import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import PersonalizationWizard, { type WizardStep } from '@components/personalization/PersonalizationWizard';
import ChildInfoForm from '@components/personalization/ChildInfoForm';
import { createPersonalization, type PersonalizationResponse } from '@lib/api/personalization';
import { addCartItem } from '@lib/api/cart';

interface BookDetailResponse {
    id: string;
    slug: string;
    title: string;
    languages: Array<{
        languageCode: string;
        titleTranslated: string;
        isAvailable: boolean;
    }>;
}

const fetchBookBySlug = async (slug: string): Promise<BookDetailResponse> => {
    const response = await apiClient.get<BookDetailResponse>(`/books/${slug}`);
    return response.data;
};

export default function PersonalizationPage() {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const languageParam = searchParams.get('language') || 'en';

    const [currentStep, setCurrentStep] = useState<WizardStep>('child-info');
    const [personalization, setPersonalization] = useState<PersonalizationResponse | null>(null);
    const [formData, setFormData] = useState<{ childFirstName: string; childAge: number; languageCode: string; childPhotoUrl: string; gender: 'male' | 'female' | 'other' } | null>(null);
    const [isCreatingPersonalization, setIsCreatingPersonalization] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Reset personalization state when page loads or slug changes
    // This ensures each personalization flow creates a NEW personalization
    useEffect(() => {
        console.log('🔄 PersonalizationPage mounted/slug changed. Resetting state for slug:', slug);
        setPersonalization(null);
        setFormData(null);
        setCurrentStep('child-info');
        setIsCreatingPersonalization(false);
        setIsAddingToCart(false);
    }, [slug]); // Reset when slug changes (different book)

    // Fetch book details
    const { data: book, isLoading: bookLoading, error: bookError } = useQuery<BookDetailResponse>({
        queryKey: ['book', slug],
        queryFn: () => fetchBookBySlug(slug!),
        enabled: !!slug,
    });

    // Create personalization mutation
    const createPersonalizationMutation = useMutation({
        mutationFn: createPersonalization,
        onSuccess: (data) => {
            console.log('✅ Personalization created successfully:', {
                id: data.id,
                childFirstName: data.childFirstName,
                childAge: data.childAge,
                status: data.status
            });
            setPersonalization(data);
            setIsCreatingPersonalization(false);
        },
        onError: (error: any) => {
            console.error('❌ Failed to create personalization:', error);
            setIsCreatingPersonalization(false);
            // If it's an auth error, we'll handle it gracefully - allow guest flow
            if (error.response?.status === 401) {
                // For guest users, we'll store data locally and create personalization at checkout
                console.log('Guest user - personalization will be created at checkout');
                // Don't show error to user - they can still fill the form
            } else {
                alert(`Failed to start personalization: ${error.response?.data?.error || error.message || 'Unknown error'}`);
            }
        },
    });

    // DON'T auto-create personalization - let the user fill the form first
    // This ensures each personalization is unique and not reused
    // The personalization will be created when the user submits the form
    useEffect(() => {
        const hasToken = !!localStorage.getItem('accessToken');
        console.log('🔄 Personalization page state:', {
            bookId: book?.id,
            bookSlug: book?.slug,
            hasToken,
            currentPersonalizationId: personalization?.id,
            hasFormData: !!formData
        });

        // Don't auto-create - this was causing the reuse issue
        // User will create a NEW personalization when they submit the form
    }, [book, personalization, formData]);


    if (bookLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (bookError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
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
                    <button
                        onClick={() => navigate('/books')}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Browse All Books</span>
                    </button>
                </div>
            </div>
        );
    }

    // For guest users, we'll create personalization when they submit the form
    // For authenticated users, we can optionally create it early, but it's not required

    if (!book) {
        return null; // This shouldn't happen due to earlier checks, but TypeScript needs it
    }



    const handleChildInfoSubmit = async (data: { childFirstName: string; childAge: number; languageCode: string; childPhotoUrl: string; gender: 'male' | 'female' | 'other' }) => {
        console.log('📝 handleChildInfoSubmit called with:', {
            childFirstName: data.childFirstName,
            childAge: data.childAge,
            hasPhoto: !!data.childPhotoUrl,
            photoLength: data.childPhotoUrl?.length
        });
        console.log('   Current personalization BEFORE:', personalization?.id);

        // Store form data for preview
        setFormData(data);

        // Check if user is authenticated
        const isAuthenticated = !!localStorage.getItem('accessToken');
        console.log('   Is authenticated:', isAuthenticated);

        // ALWAYS create a NEW personalization when submitting the form (for authenticated users)
        // This ensures each cart item gets its own unique personalization
        if (book && isAuthenticated) {
            setIsCreatingPersonalization(true);
            try {
                console.log('🆕 Creating NEW personalization for authenticated user');
                console.log('   Request:', {
                    bookId: book.id,
                    childFirstName: data.childFirstName,
                    childAge: data.childAge,
                    languageCode: data.languageCode,
                    photoUrlType: data.childPhotoUrl.startsWith('data:') ? 'base64' : 'url'
                });

                const newPersonalization = await createPersonalizationMutation.mutateAsync({
                    bookId: book.id,
                    childFirstName: data.childFirstName,
                    childAge: data.childAge,
                    childPhotoUrl: data.childPhotoUrl,
                    languageCode: data.languageCode,
                    gender: data.gender,
                });

                console.log('✅ New personalization created successfully:', {
                    id: newPersonalization.id,
                    childFirstName: newPersonalization.childFirstName,
                    childAge: newPersonalization.childAge,
                    status: newPersonalization.status
                });

                setPersonalization(newPersonalization);
                console.log('   State updated with new personalization');
            } catch (error: any) {
                console.error('❌ Personalization creation FAILED:', {
                    status: error.response?.status,
                    message: error.response?.data?.error || error.message,
                    fullError: error
                });

                // For guest users, if creation fails due to auth, store data locally
                if (error.response?.status === 401) {
                    console.log('   401 error - treating as guest user');
                    // Store personalization data in sessionStorage for checkout
                    sessionStorage.setItem('pendingPersonalization', JSON.stringify({
                        bookId: book.id,
                        bookSlug: book.slug,
                        childFirstName: data.childFirstName,
                        childAge: data.childAge,
                        childPhotoUrl: data.childPhotoUrl,
                        languageCode: data.languageCode,
                        gender: data.gender,
                    }));
                } else {
                    // For authenticated users with other errors, show alert
                    alert(`Failed to create personalization: ${error.response?.data?.error || error.message}. You can still proceed but may need to log in to complete purchase.`);
                }
            } finally {
                setIsCreatingPersonalization(false);
            }
        } else if (!isAuthenticated) {
            console.log('   Not authenticated - storing data locally for guest flow');
            // Guest user - store data for later
            sessionStorage.setItem('pendingPersonalization', JSON.stringify({
                bookId: book.id,
                bookSlug: book.slug,
                ...data
            }));
        }

        // Wait a tiny bit for state to settle before checking
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('   Current personalization AFTER (delayed check):', personalization?.id);
        console.log('   Moving to preview step');

        // Always proceed to preview step (for both authenticated and guest users)
        setCurrentStep('preview');
    };

    const handleStepChange = (step: WizardStep) => {
        setCurrentStep(step);
    };

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: addCartItem,
        onSuccess: () => {
            console.log('✅ Item added to cart successfully');

            // Invalidate cart query to refresh cart count in header
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cart', 'count'] });

            // Clear personalization state for next use
            setPersonalization(null);
            setFormData(null);

            // Show success message
            alert('Item added to cart successfully!');

            // Navigate to cart
            navigate('/cart');
        },
        onError: (error: any) => {
            console.error('Failed to add to cart:', error);
            alert(`Failed to add to cart: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        },
    });

    const handleAddToCart = async () => {
        console.log('🛒 handleAddToCart called');
        console.log('   Current personalization:', personalization?.id);
        console.log('   Current formData:', formData);
        console.log('   Book:', book?.id);

        if (!book) {
            alert('Book information is missing');
            return;
        }

        // Use formData if personalization doesn't exist (for guest users)
        const dataToUse = personalization || formData;

        if (!dataToUse) {
            console.error('❌ No personalization or formData available');
            alert('Please complete the personalization first');
            setCurrentStep('child-info');
            return;
        }

        // Validate that we have required data
        if (!dataToUse.childFirstName || !dataToUse.childPhotoUrl || !dataToUse.childAge) {
            console.error('❌ Missing required fields:', dataToUse);
            alert('Please complete all required fields before adding to cart');
            setCurrentStep('child-info');
            return;
        }

        console.log('✅ Data validation passed, proceeding to add to cart');
        setIsAddingToCart(true);

        try {
            let personalizationToUse = personalization;
            const isGuestUser = !localStorage.getItem('accessToken');

            console.log('   personalizationToUse:', personalizationToUse?.id);
            console.log('   isGuestUser:', isGuestUser);

            // IMPORTANT: If personalization doesn't exist, STOP - something went wrong
            // The personalization should have been created in handleChildInfoSubmit
            if (!personalization) {
                if (formData) {
                    console.error('⚠️  CRITICAL: Personalization is NULL but formData exists');
                    console.error('   This means personalization creation failed in handleChildInfoSubmit');
                    console.error('   Trying to create it again now...');

                    try {
                        const newPersonalization = await createPersonalizationMutation.mutateAsync({
                            bookId: book.id,
                            childFirstName: formData.childFirstName,
                            childAge: formData.childAge,
                            childPhotoUrl: formData.childPhotoUrl,
                            languageCode: formData.languageCode,
                            gender: formData.gender,
                        });
                        console.log('✅ Created personalization in handleAddToCart:', newPersonalization.id);
                        personalizationToUse = newPersonalization;
                        setPersonalization(newPersonalization);
                    } catch (error: any) {
                        console.error('❌ FAILED to create personalization:', error);
                        alert(`Failed to create personalization: ${error.response?.data?.error || error.message}. Please try refreshing the page and logging in again.`);
                        setIsAddingToCart(false);
                        return;
                    }
                } else {
                    console.error('⚠️  No personalization AND no formData - cannot add to cart');
                    alert('Personalization data is missing. Please go back and fill in the child information again.');
                    setCurrentStep('child-info');
                    setIsAddingToCart(false);
                    return;
                }
            }

            // Use the personalization from state or the one we just created
            if (!personalizationToUse) {
                console.error('⚠️  personalizationToUse is still null after all attempts');
                alert('Failed to process personalization. Please try again or contact support.');
                setIsAddingToCart(false);
                return;
            }

            console.log('📦 Proceeding with personalizationToUse:', {
                id: personalizationToUse.id,
                childFirstName: personalizationToUse.childFirstName,
                status: personalizationToUse.status
            });

            // Add to cart with personalizationId (skip approval step - not needed)
            console.log('🛒 Calling add to cart API with:', {
                bookId: book.id,
                personalizationId: personalizationToUse.id,
                quantity: 1,
                languageCode: personalizationToUse.languageCode || languageParam,
            });

            await addToCartMutation.mutateAsync({
                bookId: book.id,
                personalizationId: personalizationToUse.id,
                quantity: 1,
                languageCode: personalizationToUse.languageCode || languageParam,
            });
        } catch (error: any) {
            // Error is already handled in mutation onError or above
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Show loading while creating personalization initially
    if (isCreatingPersonalization && !personalization) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Setting up personalization...</p>
                </div>
            </div>
        );
    }


    // Get the best available data for the form (prioritize formData, then personalization)
    const getFormInitialData = () => {
        if (formData) {
            return {
                childFirstName: formData.childFirstName,
                childAge: formData.childAge,
                languageCode: formData.languageCode,
                childPhotoUrl: formData.childPhotoUrl,
                gender: formData.gender,
            };
        }
        if (personalization) {
            return {
                childFirstName: personalization.childFirstName || '',
                childAge: personalization.childAge || undefined,
                languageCode: personalization.languageCode || languageParam,
                childPhotoUrl: personalization.childPhotoUrl || '',
                gender: personalization.gender,
            };
        }
        return {
            childFirstName: '',
            childAge: undefined,
            languageCode: languageParam,
            childPhotoUrl: '',
            gender: undefined,
        };
    };

    return (
        <PersonalizationWizard currentStep={currentStep} onStepChange={handleStepChange}>
            {currentStep === 'child-info' ? (
                <div className="lg:grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Form */}
                    <div className="space-y-8">
                        <ChildInfoForm
                            key={`child-info-${personalization?.id || 'temp'}`}
                            personalizationId={personalization?.id || 'temp'}
                            initialData={getFormInitialData()}
                            onSubmit={handleChildInfoSubmit}
                            onChange={(data) => setFormData(prev => ({ ...prev, ...data } as any))}
                            onNext={() => setCurrentStep('preview')}
                        />
                    </div>

                    {/* Right Side: Professional Magic Preview */}
                    <div className="hidden lg:block sticky top-8">
                        <div className="relative group">
                            {/* Decorative Background Elements */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-[3rem] blur-2xl opacity-60"></div>

                            <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-gray-100 p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden min-h-[450px] flex flex-col items-stretch">
                                {/* Top Header: Book Title */}
                                <div className="text-center mb-8">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] block mb-2">Currently Personalizing</span>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight px-4 capitalize">
                                        {book?.title || "Unknown Adventure"}
                                    </h3>
                                </div>

                                {/* Main Visual Area */}
                                <div className="relative mb-10">
                                    <div className="relative w-56 h-56 mx-auto rounded-3xl p-3 bg-white shadow-2xl overflow-hidden border border-gray-100 rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                        {formData?.childPhotoUrl ? (
                                            <img
                                                src={formData.childPhotoUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-300">
                                                <svg className="w-16 h-16 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Awaiting Portrait</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Name Plaque */}
                                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 px-6 py-3 rounded-xl shadow-2xl border border-gray-800 whitespace-nowrap -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1.5">Lead Protagonist</span>
                                            <span className="text-lg font-bold text-white tracking-wide">
                                                {formData?.childFirstName || "???"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Book Specifications Table */}
                                <div className="space-y-4 pt-4 mt-auto border-t border-gray-100/50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Target Age</p>
                                            <p className="font-bold text-gray-800 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                                {formData?.childAge || "0"} Years
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100/50">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Lead Gender</p>
                                            <p className="font-bold text-gray-800 flex items-center gap-2 capitalize">
                                                <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                                                {formData?.gender || "Neutral"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-600/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Story Narrative</p>
                                            <span className="bg-white px-2 py-0.5 rounded-md text-[8px] font-black text-indigo-600 shadow-sm border border-indigo-100 uppercase">Premium Edition</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                            A custom-woven adventure starring <b className="text-gray-900">{formData?.childFirstName || "your child"}</b>,
                                            meticulously adapted for <b className="text-gray-900">{formData?.childAge || "appropriate"}</b> year old reading levels.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Perspective Shadow */}
                            <div className="mt-8 mx-auto w-3/4 h-6 bg-black/[0.03] rounded-full blur-xl"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 max-w-2xl mx-auto">
                    <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Your Magic is Ready!</h2>
                    <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                        We've captured your personalization perfectly. Review the details below before we weave them into your masterpiece.
                    </p>

                    {/* Personalization Summary Card */}
                    {(personalization || formData) && (
                        <div className="bg-white rounded-3xl p-8 mb-10 text-left border border-gray-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>

                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Final Details</h3>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                                        <img
                                            src={personalization?.childPhotoUrl || formData?.childPhotoUrl || ''}
                                            alt="Child photo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-extrabold text-gray-900">{personalization?.childFirstName || formData?.childFirstName}</p>
                                        <p className="text-indigo-600 font-bold tracking-wide uppercase text-xs mt-1">
                                            {personalization?.childAge || formData?.childAge} Years • {personalization?.gender || formData?.gender}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Language</p>
                                        <p className="font-extrabold text-gray-700">English (US)</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Story Edition</p>
                                        <p className="font-extrabold text-gray-700 capitalize">{book?.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setCurrentStep('child-info')}
                            disabled={isAddingToCart}
                            className="px-8 py-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 font-bold text-gray-600"
                        >
                            Edit Information
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || (!personalization && !formData)}
                            className="px-12 py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 font-extrabold text-xl shadow-xl flex items-center justify-center gap-3 transform hover:-translate-y-1"
                        >
                            {isAddingToCart ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <span>Add to Cart</span>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </PersonalizationWizard>
    );
}

