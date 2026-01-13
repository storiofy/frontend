import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderByNumber, type OrderResponse } from '@lib/api/checkout';

export default function OrderConfirmationPage() {
    const { orderNumber } = useParams<{ orderNumber: string }>();

    const { data: order, isLoading, error } = useQuery<OrderResponse>({
        queryKey: ['order', orderNumber],
        queryFn: () => getOrderByNumber(orderNumber!),
        enabled: !!orderNumber,
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            We couldn't find an order with number {orderNumber}. Please check the order number and try again.
                        </p>
                        <Link
                            to="/books"
                            className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Success Banner */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
                    <p className="text-gray-600 text-lg">
                        Your order has been placed successfully
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-indigo-200 text-sm">Order Number</p>
                                <p className="text-2xl font-bold">{order.orderNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-indigo-200 text-sm">Order Placed</p>
                                <p className="font-medium">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${
                                    order.status === 'pending' ? 'bg-yellow-400' :
                                    order.status === 'processing' ? 'bg-blue-400' :
                                    order.status === 'shipped' ? 'bg-indigo-400' :
                                    order.status === 'delivered' ? 'bg-green-400' :
                                    'bg-gray-400'
                                }`}></span>
                                <span className="font-medium text-gray-900 capitalize">{order.status}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                                Estimated Delivery: {formatDate(order.estimatedDeliveryDate)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500">Order Placed</span>
                                <span className="text-xs text-gray-500">Processing</span>
                                <span className="text-xs text-gray-500">Shipped</span>
                                <span className="text-xs text-gray-500">Delivered</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-2 bg-gradient-to-r from-indigo-500 to-green-500 rounded-full transition-all duration-500"
                                    style={{
                                        width: order.status === 'pending' ? '25%' :
                                               order.status === 'processing' ? '50%' :
                                               order.status === 'shipped' ? '75%' :
                                               order.status === 'delivered' ? '100%' : '0%'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-16 h-20 from-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900">
                                            {item.bookTitle || 'Product'}
                                        </h3>
                                        {item.personalizationId && (
                                            <p className="text-sm text-indigo-600">✨ Personalized</p>
                                        )}
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">${item.subtotal.toFixed(2)}</p>
                                        {item.discountPercentage > 0 && (
                                            <p className="text-sm text-green-600">-{item.discountPercentage}% off</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Shipping Address
                            </h3>
                            <div className="text-gray-900">
                                <p className="font-medium">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.streetAddress}</p>
                                <p>
                                    {order.shippingAddress.city}
                                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                                </p>
                                <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && (
                                    <p className="text-gray-500 mt-1">{order.shippingAddress.phone}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Payment Method
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 from-purple-100 rounded-2xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                                    <p className="text-sm text-gray-500">Pay when your order arrives</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Totals */}
                    <div className="p-6 bg-gray-50">
                        <div className="max-w-xs ml-auto space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping ({order.shippingMethod})</span>
                                {order.shippingCost === 0 ? (
                                    <span className="text-green-600 font-medium">FREE</span>
                                ) : (
                                    <span>${order.shippingCost.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-${order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Order Confirmation</p>
                                <p className="text-sm text-gray-500">We've sent a confirmation email with your order details</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 from-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Order Processing</p>
                                <p className="text-sm text-gray-500">We're preparing your personalized items with care</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Delivery</p>
                                <p className="text-sm text-gray-500">Your order will arrive by {formatDate(order.estimatedDeliveryDate)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/books"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-colors shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Continue Shopping
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Receipt
                    </button>
                </div>

                {/* Customer Support */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>
                        Questions about your order?{' '}
                        <Link to="/support" className="text-indigo-600 hover:underline">
                            Contact our support team
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

