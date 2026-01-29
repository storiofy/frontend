import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@lib/api/client';
import { createPersonalization, type PersonalizationResponse } from '@lib/api/personalization';
import { addCartItem } from '@lib/api/cart';
import { Check, Upload, X, ChevronDown, ArrowRight, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '@components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@components/ui/label';
import { Input } from '@components/ui/input';
import { Slider } from '@components/ui/slider';
import { useCurrencyStore } from '@store/currencyStore';
import { getCurrencySymbol } from '@lib/utils/currency';

interface BookDetailResponse {
    id: string;
    slug: string;
    title: string;
    coverImageUrl: string;
    finalPrice: number;
    basePrice: number;
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
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { currency } = useCurrencyStore();

    // UI State
    const [activeStep, setActiveStep] = useState(2); // Start at Step 2 since book is usually selected
    const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

    // Form State
    const [childName, setChildName] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
    const [age, setAge] = useState([5]);
    const [uploadedPhoto, setUploadedPhoto] = useState('');
    const selectedLanguage = 'en';

    const [isCreatingPersonalization, setIsCreatingPersonalization] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [personalization, setPersonalization] = useState<PersonalizationResponse | null>(null);

    // Steps definition
    const steps = [
        { id: 1, title: 'Select Book' },
        { id: 2, title: 'Child Information' },
        { id: 3, title: 'Review & Order' }
    ];

    // Fetch book details
    const { data: book, isLoading: bookLoading, error: bookError } = useQuery<BookDetailResponse>({
        queryKey: ['book', slug],
        queryFn: () => fetchBookBySlug(slug!),
        enabled: !!slug,
    });

    const isStepComplete = (stepId: number) => completedSteps.includes(stepId);
    const canOpenStep = (stepId: number) => stepId === 1 || completedSteps.includes(stepId - 1);

    const completeStep = (stepId: number) => {
        if (!completedSteps.includes(stepId)) {
            setCompletedSteps([...completedSteps, stepId]);
        }
        if (stepId < 3) {
            setActiveStep(stepId + 1);
        }
    };

    // Mutation for creating personalization
    const createPersonalizationMutation = useMutation({
        mutationFn: createPersonalization,
    });

    const handleContinueToReview = async () => {
        if (!book || !childName || !gender) return;

        setIsCreatingPersonalization(true);
        const isAuthenticated = !!localStorage.getItem('accessToken');

        const personalizationData = {
            bookId: book.id,
            childFirstName: childName,
            childAge: age[0],
            childPhotoUrl: uploadedPhoto,
            languageCode: selectedLanguage,
            gender: gender as 'male' | 'female' | 'other',
        };

        try {
            const newPersonalization = await createPersonalizationMutation.mutateAsync(personalizationData);
            setPersonalization(newPersonalization);
        } catch (error) {
            console.error('Failed to create personalization:', error);
            // Fallback to session storage if API fails (e.g. if backend strictly requires auth)
            if (!isAuthenticated) {
                sessionStorage.setItem('pendingPersonalization', JSON.stringify({
                    bookSlug: book.slug,
                    ...personalizationData
                }));
            }
        }

        setIsCreatingPersonalization(false);
        completeStep(2);
    };

    const handleAddToCart = async () => {
        if (!book) return;
        setIsAddingToCart(true);

        try {
            let finalPersonalization = personalization;


            // If personalization wasn't created yet or failed
            if (!finalPersonalization) {
                finalPersonalization = await createPersonalizationMutation.mutateAsync({
                    bookId: book.id,
                    childFirstName: childName,
                    childAge: age[0],
                    childPhotoUrl: uploadedPhoto,
                    languageCode: selectedLanguage,
                    gender: gender as 'male' | 'female' | 'other',
                });
                setPersonalization(finalPersonalization);
            }

            // Add to cart logic
            await addCartItem({
                bookId: book.id,
                personalizationId: finalPersonalization?.id || 'guest',
                quantity: 1,
                languageCode: selectedLanguage,
            });

            queryClient.invalidateQueries({ queryKey: ['cart'] });
            navigate('/cart');
        } catch (error) {
            console.error('Add to cart failed:', error);
            alert('Failed to add to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (bookLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (bookError || !book) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <X className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
                <p className="text-gray-600 mb-6">We couldn't find the adventure you're looking for.</p>
                <button onClick={() => navigate('/books')} className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold">Browse Adventures</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                {/* Progress Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Personalize Your Story</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Follow the steps below to create a unique adventure</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all z-10 shadow-lg ${isStepComplete(step.id)
                                        ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                                        : activeStep === step.id
                                            ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white ring-4 ring-pink-50'
                                            : 'bg-white border-2 border-gray-100 text-gray-300'
                                        }`}>
                                        {isStepComplete(step.id) ? <Check className="w-5 h-5" /> : step.id}
                                    </div>
                                    <p className={`absolute -bottom-7 w-max text-[10px] font-black uppercase tracking-widest ${activeStep === step.id ? 'text-pink-600' : 'text-gray-400'}`}>
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 mx-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-700 ${isStepComplete(step.id) ? 'w-full bg-gradient-to-r from-pink-500 to-blue-500' : 'w-0'
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Accordion Panels */}
                <div className="space-y-4 max-w-4xl mx-auto">
                    {/* Step 1: Book Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => setActiveStep(activeStep === 1 ? 0 : 1)}
                            className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isStepComplete(1) ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
                                    }`}>1</div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">Selected Adventure</p>
                                    <p className="text-xs text-gray-500 capitalize">{book.title}</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === 1 ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {activeStep === 1 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-50"
                                >
                                    <div className="p-6 flex gap-6 items-center">
                                        <ImageWithFallback
                                            src={book.coverImageUrl}
                                            alt={book.title}
                                            className="w-24 aspect-[3/4] object-cover rounded-xl shadow-md"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-pink-600 font-bold">${book.finalPrice}</span>
                                                <span className="text-xs text-gray-400 line-through">${book.basePrice}</span>
                                            </div>
                                            <button
                                                onClick={() => setActiveStep(2)}
                                                className="text-xs font-bold text-blue-600 hover:underline"
                                            >Change book</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Step 2: Information */}
                    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${activeStep === 2 ? 'border-pink-200 ring-4 ring-pink-50' : 'border-gray-100'
                        }`}>
                        <button
                            onClick={() => canOpenStep(2) && setActiveStep(activeStep === 2 ? 0 : 2)}
                            className="w-full px-6 py-5 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === 2 ? 'bg-pink-600 text-white shadow-md shadow-pink-200' : isStepComplete(2) ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
                                    }`}>2</div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">Child Information</p>
                                    <p className="text-xs text-gray-500">Add the details to make it personal</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeStep === 2 ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {activeStep === 2 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-50"
                                >
                                    <div className="p-8 grid md:grid-cols-2 gap-10 items-start">
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Child's Name</Label>
                                                <Input
                                                    placeholder="e.g. Charlie"
                                                    value={childName}
                                                    onChange={e => setChildName(e.target.value)}
                                                    className="h-11 rounded-xl border-2 border-gray-100 font-bold text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Gender</Label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { id: 'male', label: 'Boy', icon: '👦' },
                                                        { id: 'female', label: 'Girl', icon: '👧' },
                                                        { id: 'other', label: 'Other', icon: '🧒' }
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => setGender(opt.id as any)}
                                                            className={`p-3 rounded-xl border-2 transition-all ${gender === opt.id ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-gray-50 bg-gray-50/50 hover:border-pink-100'
                                                                }`}
                                                        >
                                                            <div className="text-2xl mb-1">{opt.icon}</div>
                                                            <div className="text-[9px] font-black uppercase tracking-widest">{opt.label}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Child's Age</Label>
                                                    <span className="text-pink-600 font-black text-xs bg-pink-50 px-2 py-0.5 rounded-lg">{age[0]} years</span>
                                                </div>
                                                <Slider
                                                    value={age}
                                                    onValueChange={setAge}
                                                    min={1}
                                                    max={12}
                                                    step={1}
                                                />
                                            </div>
                                            <div className="pb-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Photo (Optional)</Label>
                                                <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center hover:border-pink-200 transition-all cursor-pointer bg-gray-50/50 group">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        id="photo-upload"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setUploadedPhoto(reader.result as string);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                                        {uploadedPhoto ? (
                                                            <div className="relative inline-block">
                                                                <img src={uploadedPhoto} className="w-16 h-16 object-cover rounded-lg shadow-sm" alt="Uploaded" />
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); setUploadedPhoto(''); }}
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <Upload className="w-6 h-6 text-gray-400 mb-1 group-hover:text-pink-500 transition" />
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Portrait</span>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleContinueToReview}
                                                disabled={!childName || !gender || isCreatingPersonalization}
                                                className="w-full bg-gradient-to-r from-blue-600 to-pink-600 text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-pink-100 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                                            >
                                                {isCreatingPersonalization ? 'Creating Magic...' : (
                                                    <>
                                                        Continue to Review
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center">
                                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-500/80 mb-8">Live Story Preview</span>

                                            {/* Portrait Section - Smaller and More Elegant */}
                                            <div className="relative mb-12 w-full max-w-[200px] aspect-square">
                                                <div className="w-full h-full bg-white rounded-[3rem] border-4 border-gray-50 flex flex-col items-center justify-center p-8 text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)]">
                                                    {uploadedPhoto ? (
                                                        <img src={uploadedPhoto} className="w-full h-full object-cover rounded-[2rem]" alt="Preview" />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center border border-gray-100">
                                                                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-gray-200" stroke="currentColor" strokeWidth="1.5">
                                                                    <path d="M12 15L12 15.01M17 10.5C17 13.5 14.3137 15.5 12 15.5C9.68629 15.5 7 13.5 7 10.5C7 7.73858 9.23858 5.5 12 5.5C14.7614 5.5 17 7.73858 17 10.5Z" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <rect x="3" y="3" width="18" height="18" rx="5" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-300">Awaiting Portrait</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[90%] bg-[#0F172A] rounded-xl p-3.5 shadow-xl z-10 border border-white/5">
                                                    <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-indigo-400 mb-1">Lead Protagonist</p>
                                                    <p className="text-lg font-black text-white tracking-tight truncate">{childName || '???'}</p>
                                                </div>
                                            </div>

                                            {/* Integrated Info Pill - Minimalist and Unified */}
                                            <div className="bg-gray-50/50 rounded-2xl px-6 py-4 flex items-center justify-between w-full border border-gray-100/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-100"></div>
                                                    <div>
                                                        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">Age Target</p>
                                                        <p className="text-sm font-black text-gray-900">{age[0]} Years</p>
                                                    </div>
                                                </div>
                                                <div className="h-6 w-px bg-gray-200"></div>
                                                <div className="flex items-center gap-3 text-right">
                                                    <div>
                                                        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-400">Story Edition</p>
                                                        <p className="text-sm font-black text-gray-900">
                                                            {gender === 'male' ? 'Boy' : gender === 'female' ? 'Girl' : gender === 'other' ? 'Other' : 'Neutral'}
                                                        </p>
                                                    </div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#D946EF] shadow-sm shadow-pink-100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Step 3: Review & Order */}
                    <div className={`bg-white rounded-lg shadow-sm overflow-hidden border-2 transition ${activeStep === 3 ? 'border-pink-300' : 'border-transparent hover:border-pink-100'
                        } ${!canOpenStep(3) ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button
                            onClick={() => canOpenStep(3) && setActiveStep(activeStep === 3 ? 0 : 3)}
                            className="w-full px-5 py-4 flex items-center justify-between"
                            disabled={!canOpenStep(3)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isStepComplete(3) ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white' :
                                    activeStep === 3 ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white' : 'bg-gray-200'
                                    }`}>
                                    {isStepComplete(3) ? <Check className="w-4 h-4" /> : '3'}
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-sm">Review & Order</p>
                                    <p className="text-xs text-gray-500">Final check</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 transition-transform ${activeStep === 3 ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {activeStep === 3 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-5 border-t">
                                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                                            {/* Preview */}
                                            <div>
                                                <ImageWithFallback
                                                    src={book.coverImageUrl}
                                                    alt="Final preview"
                                                    className="w-full h-64 object-cover rounded-lg mb-3"
                                                />
                                                <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-lg p-3 text-xs">
                                                    <p className="font-semibold mb-2">Your Details:</p>
                                                    <p>Name: <span className="font-semibold">{childName}</span></p>
                                                    <p>Age: <span className="font-semibold">{age[0]} years</span></p>
                                                    <p>Gender: <span className="font-semibold capitalize">{gender}</span></p>
                                                </div>
                                            </div>

                                            {/* Order Summary */}
                                            <div>
                                                <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-lg p-4 mb-3">
                                                    <h3 className="font-semibold mb-3 text-sm">Order Summary</h3>
                                                    <div className="space-y-2 text-xs">
                                                        <div className="flex justify-between">
                                                            <span>Subtotal</span>
                                                            <span className="font-semibold">{getCurrencySymbol(currency)}{book.finalPrice}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Shipping</span>
                                                            <span className="font-semibold text-green-600">FREE</span>
                                                        </div>
                                                        <div className="border-t pt-2 flex justify-between font-bold text-sm">
                                                            <span>Total</span>
                                                            <span className="text-pink-600">{getCurrencySymbol(currency)}{book.finalPrice}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={isAddingToCart}
                                                    className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest hover:from-pink-600 hover:to-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {isAddingToCart ? 'ADDING...' : 'ADD TO BAG'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

