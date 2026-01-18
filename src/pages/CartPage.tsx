import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
    getCart,
    removeCartItem,
    updateCartItem,
    clearCart,
    type CartItemResponse,
} from '@lib/api/cart';
export default function CartPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

    // Fetch cart data
    const {
        data: cart,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const cartData = await getCart();
            // Debug logging - check personalization data
            console.log('Cart data received:', cartData);
            cartData.items.forEach((item, index) => {
                console.log(`Cart item ${index}:`, {
                    id: item.id,
                    bookTitle: item.bookTitle,
                    personalizationId: item.personalizationId,
                    personalizationChildFirstName: item.personalizationChildFirstName,
                    personalizationChildAge: item.personalizationChildAge,
                    personalizationChildPhotoUrl: item.personalizationChildPhotoUrl,
                });
            });
            return cartData;
        },
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
        if (newQuantity < 1) {
            return;
        }

        setUpdatingItems((prev) => new Set(prev).add(item.id));

        try {
            await updateQuantityMutation.mutateAsync({
                itemId: item.id,
                quantity: newQuantity,
            });
        } finally {
            setUpdatingItems((prev) => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
            });
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (window.confirm('Are you sure you want to remove this item from your cart?')) {
            await removeItemMutation.mutateAsync(itemId);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your entire cart?')) {
            await clearCartMutation.mutateAsync();
        }
    };

    const handleCheckout = () => {
        // Go directly to checkout - supports both authenticated users and guest checkout
        navigate('/checkout');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded-xl w-48 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 h-32"></div>
                                ))}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl p-6 h-64"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-800 mb-2">
                            Error Loading Cart
                        </h2>
                        <p className="text-red-600 mb-6">
                            {error instanceof Error ? error.message : 'Failed to load cart items'}
                        </p>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['cart'] })}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Try Again</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full mb-6">
                            <svg
                                className="h-16 w-16 text-indigo-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start your story adventure! Browse our collection of personalized books.
                        </p>
                        <Link
                            to="/books"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>Explore Books</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                        <p className="text-gray-600">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart</p>
                    </div>
                    {cart.items.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            disabled={clearCartMutation.isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>{clearCartMutation.isPending ? 'Clearing...' : 'Clear Cart'}</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col sm:flex-row gap-6 border border-gray-100"
                            >
                                {/* Product Image */}
                                <Link
                                    to={`/books/${item.bookSlug}`}
                                    className="flex-shrink-0 group"
                                >
                                    <img
                                        src={
                                            item.bookCoverImageUrl ||
                                            'https://via.placeholder.com/150x200?text=Product'
                                        }
                                        alt={item.bookTitle || 'Product'}
                                        className="w-full sm:w-32 h-48 sm:h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                    />
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <Link
                                            to={`/books/${item.bookSlug}`}
                                            className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors block truncate"
                                        >
                                            {item.bookTitle}
                                        </Link>

                                        {/* Personalization Details Card */}
                                        {item.personalizationId && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm">
                                                <div className="flex items-start gap-3">
                                                    {/* Child Photo */}
                                                    {item.personalizationChildPhotoUrl && (
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={item.personalizationChildPhotoUrl}
                                                                alt={`Photo of ${item.personalizationChildFirstName || 'child'}`}
                                                                className="w-16 h-16 object-cover rounded-full border-2 border-indigo-200 shadow-md ring-2 ring-white"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Personalization Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-lg">✨</span>
                                                            <span className="text-sm font-bold text-indigo-700 uppercase tracking-wide">Personalized Edition</span>
                                                        </div>

                                                        {item.personalizationChildFirstName && (
                                                            <div className="space-y-1">
                                                                <p className="text-sm text-gray-700">
                                                                    <span className="font-semibold">Child's Name:</span>{' '}
                                                                    <span className="text-indigo-600 font-bold">{item.personalizationChildFirstName}</span>
                                                                </p>
                                                                {item.personalizationChildAge !== undefined && (
                                                                    <p className="text-sm text-gray-700">
                                                                        <span className="font-semibold">Age:</span>{' '}
                                                                        <span className="font-bold">{item.personalizationChildAge}</span> years old
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {!item.personalizationChildPhotoUrl && (
                                                            <p className="text-xs text-gray-500 mt-1.5 italic flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                No photo uploaded
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-600 mt-3 flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                            <span className="font-semibold">Language:</span> {item.languageCode.toUpperCase()}
                                        </p>
                                    </div>

                                    {/* Quantity and Price Controls */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-3">
                                            <label htmlFor={`quantity-${item.id}`} className="text-sm font-semibold text-gray-700">
                                                Qty:
                                            </label>
                                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item, item.quantity - 1)
                                                    }
                                                    disabled={
                                                        item.quantity <= 1 ||
                                                        updatingItems.has(item.id)
                                                    }
                                                    className="px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    id={`quantity-${item.id}`}
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newQuantity = parseInt(e.target.value) || 1;
                                                        handleQuantityChange(item, newQuantity);
                                                    }}
                                                    disabled={updatingItems.has(item.id)}
                                                    className="w-16 text-center border-0 focus:ring-0 focus:outline-none disabled:opacity-50 font-semibold text-gray-900"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(item, item.quantity + 1)
                                                    }
                                                    disabled={updatingItems.has(item.id)}
                                                    className="px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900">
                                                ${item.totalPrice.toFixed(2)}
                                            </p>
                                            {item.discountAmount > 0 && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    ${(item.totalPrice + item.discountAmount).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <div className="flex items-start">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        disabled={removeItemMutation.isPending}
                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl disabled:opacity-50 transition-all group"
                                        aria-label="Remove item"
                                        title="Remove from cart"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-4 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>Order Summary</span>
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-semibold">${cart.totals.subtotal.toFixed(2)}</span>
                                </div>

                                {cart.totals.discount > 0 && (
                                    <div className="flex justify-between text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                        <span className="font-medium">Discount</span>
                                        <span className="font-bold">-${cart.totals.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Shipping</span>
                                    <span className="font-semibold">
                                        {cart.totals.shipping === 0 ? (
                                            <span className="text-green-600 font-bold flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Free
                                            </span>
                                        ) : (
                                            `$${cart.totals.shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span className="font-medium">Tax</span>
                                    <span className="font-semibold">${cart.totals.tax.toFixed(2)}</span>
                                </div>

                                <div className="border-t-2 border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-3xl font-bold text-indigo-600">${cart.totals.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg text-center hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                            >
                                Proceed to Checkout
                            </button>

                            <p className="text-sm text-gray-600 text-center mt-4 flex items-center justify-center gap-1">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Secure checkout</span>
                            </p>

                            <p className="text-sm text-gray-600 text-center mt-2">
                                Checkout as guest or{' '}
                                <Link
                                    to="/login?redirect=/cart"
                                    className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                                >
                                    sign in
                                </Link>{' '}
                                for faster checkout
                            </p>

                            <Link
                                to="/books"
                                className="flex items-center justify-center gap-2 text-center text-indigo-600 hover:text-indigo-700 font-semibold mt-6 hover:bg-indigo-50 py-2 rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Continue Shopping</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




