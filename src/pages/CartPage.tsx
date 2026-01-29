import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrencyStore } from '@store/currencyStore';
import { getCurrencySymbol } from '@lib/utils/currency';
import {
    getCart,
    removeCartItem,
    updateCartItem,
    clearCart,
    type CartItemResponse,
    type CartResponse,
} from '@lib/api/cart';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Shield, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@components/figma/ImageWithFallback';

export default function CartPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { currency } = useCurrencyStore();
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

    // Fetch cart data
    const {
        data: cart,
        isLoading,
        error,
    } = useQuery<CartResponse>({
        queryKey: ['cart', currency],
        queryFn: () => getCart(currency),
        refetchOnWindowFocus: false,
    });

    // Remove item mutation
    const removeItemMutation = useMutation({
        mutationFn: (itemId: string) => removeCartItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    // Update quantity mutation
    const updateQuantityMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            updateCartItem(itemId, { quantity }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    // Clear cart mutation
    const clearCartMutation = useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const handleQuantityChange = async (item: CartItemResponse, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdatingItems((prev) => new Set(prev).add(item.id));
        try {
            await updateQuantityMutation.mutateAsync({ itemId: item.id, quantity: newQuantity });
        } finally {
            setUpdatingItems((prev) => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
            });
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (window.confirm('Remove this item from your cart?')) {
            await removeItemMutation.mutateAsync(itemId);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Clear your entire cart?')) {
            await clearCartMutation.mutateAsync();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-pink-50/30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (error || !cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-20 flex items-center justify-center">
                <div className="max-w-md w-full px-6 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <ShoppingBag className="w-12 h-12 text-pink-500" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Your cart is empty</h1>
                    <p className="text-xs font-bold text-gray-500 mb-10 uppercase tracking-widest text-[10px]">Start your story adventure! Browse our collection of personalized books.</p>
                    <button
                        onClick={() => navigate('/books')}
                        className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white h-12 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                    >
                        Explore Stories
                    </button>
                    <Link to="/" className="inline-block mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition">Back to Home</Link>
                </div>
            </div>
        );
    }

    const currencySymbol = getCurrencySymbol(currency);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow bg-gradient-to-br from-pink-50 via-blue-50 to-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                    {/* Back button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-pink-500 transition mb-8 group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                                        <ShoppingBag className="w-6 h-6 text-pink-500" />
                                        Shopping Bag
                                    </h1>
                                    <p className="text-[10px] font-black text-gray-400 mt-1 uppercase tracking-widest">
                                        {cart.items.length} {cart.items.length === 1 ? 'adventure' : 'adventures'} ready for print
                                    </p>
                                </div>
                                <button
                                    onClick={handleClearCart}
                                    className="text-[10px] font-black text-gray-400 hover:text-red-500 transition flex items-center gap-1.5 uppercase tracking-widest"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear Bag
                                </button>
                            </div>

                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl p-6 flex gap-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden"
                                    >
                                        {/* Product Image */}
                                        <div className="w-20 h-28 md:w-24 md:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                                            <ImageWithFallback
                                                src={item.bookCoverImageUrl}
                                                alt={item.bookTitle}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2.5">
                                                    <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-pink-600 transition truncate max-w-[180px] md:max-w-md">
                                                        {item.bookTitle}
                                                    </h3>

                                                    {/* Character Badge */}
                                                    {item.personalizationId && (
                                                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-pink-50 rounded-xl border border-pink-100/50">
                                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
                                                                {item.personalizationChildPhotoUrl ? (
                                                                    <img src={item.personalizationChildPhotoUrl} className="w-full h-full object-cover" alt="Child" />
                                                                ) : (
                                                                    <span className="text-sm">👤</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className="text-pink-500 font-black uppercase tracking-widest leading-none mb-1 text-[8px]">
                                                                    STARRING
                                                                </div>
                                                                <div className="text-xs font-black text-gray-900 leading-none">
                                                                    {item.personalizationChildFirstName} <span className="text-gray-400 font-bold ml-1 text-[10px]">({item.personalizationChildAge}yr)</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LANGUAGE: {item.languageCode}</p>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Quantity and Price */}
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center bg-gray-50 rounded-xl p-0.5 border border-gray-100">
                                                    <button
                                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition disabled:opacity-30"
                                                        disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                                                    >
                                                        <Minus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition disabled:opacity-30"
                                                        disabled={updatingItems.has(item.id)}
                                                    >
                                                        <Plus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-xl font-black text-gray-900 leading-none tracking-tight">
                                                        {currencySymbol}{item.totalPrice.toFixed(0)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden sticky top-8">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-[100px] blur-2xl"></div>

                                <h2 className="text-lg font-black mb-8 tracking-tight">Order Insight</h2>

                                <div className="space-y-5 mb-10 pb-8 border-b border-white/10">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-xs text-white uppercase font-black">{currencySymbol}{cart.totals.subtotal.toFixed(0)}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Delivery</span>
                                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">FREE</span>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Taxes</span>
                                        <span className="text-xs text-white uppercase font-black">{currencySymbol}{cart.totals.tax.toFixed(0)}</span>
                                    </div>

                                    {cart.totals.discount > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-pink-400">
                                            <span>Discount</span>
                                            <span className="text-xs font-black">-{currencySymbol}{cart.totals.discount.toFixed(0)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-10">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
                                        Total Amount
                                    </div>
                                    <div className="text-4xl font-black tracking-tighter leading-none">
                                        {currencySymbol}{cart.totals.total.toFixed(0)}
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full h-12 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition shadow-lg shadow-white/5 flex items-center justify-center gap-2 group mb-6"
                                >
                                    Proceed to Checkout <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="flex items-center justify-center gap-3 text-gray-400 border-t border-white/5 pt-6">
                                    <Shield className="w-4 h-4 text-blue-400" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Protected Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
