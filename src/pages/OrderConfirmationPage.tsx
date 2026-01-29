import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderByNumber, type OrderResponse } from '@lib/api/checkout';
import { getCurrencySymbol, type CurrencyCode } from '@lib/utils/currency';
import { Check, Package, Truck, Calendar, ArrowRight, Printer, Mail, MessageSquare, Sparkles, ShoppingBag, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrencyStore } from '@store/currencyStore';

export default function OrderConfirmationPage() {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    const { currency } = useCurrencyStore();

    const { data: order, isLoading, error } = useQuery<OrderResponse>({
        queryKey: ['order', orderNumber, currency],
        queryFn: () => getOrderByNumber(orderNumber!),
        enabled: !!orderNumber,
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading your adventure...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-24">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12">
                        <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-pink-500" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Order Not Found</h2>
                        <p className="text-gray-500 font-bold mb-8">
                            We couldn't find order <span className="text-gray-900">#{orderNumber}</span>. It might still be processing or the link is incorrect.
                        </p>
                        <Link
                            to="/books"
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all"
                        >
                            Back to Books <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Soon';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const currencySymbol = getCurrencySymbol((order.currencyCode as CurrencyCode) || currency);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-16">
            <div className="max-w-5xl mx-auto px-4">

                {/* Success Header */}
                <div className="text-center mb-16 relative">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-[2rem] mb-8 shadow-xl shadow-pink-200"
                    >
                        <Check className="w-12 h-12 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-black text-gray-900 mb-4 tracking-tight"
                    >
                        Adventure Booked!
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]"
                    >
                        Order #{order.orderNumber} is now in our magic workshop
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Order details */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Order Summary Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${order.status === 'pending' ? 'bg-yellow-400' :
                                            order.status === 'processing' ? 'bg-blue-400' :
                                                order.status === 'shipped' ? 'bg-indigo-400' :
                                                    'bg-emerald-400'
                                            }`} />
                                        <p className="text-lg font-black uppercase tracking-widest leading-none">{order.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Booked On</p>
                                    <p className="text-lg font-black leading-none">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Items in your package</h2>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-6 p-6 rounded-[2rem] bg-gray-50 group transition">
                                                <div className="w-20 h-24 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white">
                                                    <img src={item.bookCoverImageUrl || ''} alt={item.bookTitle} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-black text-gray-900 mb-1 truncate">{item.bookTitle || 'Custom Adventure'}</h3>
                                                    {item.personalizationId && (
                                                        <div className="flex items-center gap-1.5 text-pink-500 mb-2">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Personalized For {item.personalizationChildFirstName || 'You'}</span>
                                                        </div>
                                                    )}
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-gray-900">{currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping To</h3>
                                        <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50">
                                            <p className="font-black text-gray-900">{order.shippingAddress.fullName}</p>
                                            <p className="text-sm font-bold text-gray-600 mt-1">{order.shippingAddress.streetAddress}</p>
                                            <p className="text-sm font-bold text-gray-600">
                                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                            </p>
                                            <p className="text-sm font-bold text-gray-600">{order.shippingAddress.country}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</h3>
                                        <div className="p-6 rounded-3xl bg-pink-50/50 border border-pink-100/50 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                <Truck className="w-6 h-6 text-pink-500" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900">Cash on Delivery</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Pay at Doorstep</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracker Visual */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-10">Magic Tracker</h2>
                            <div className="relative">
                                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: order.status === 'pending' ? '25%' :
                                                order.status === 'processing' ? '50%' :
                                                    order.status === 'shipped' ? '75%' : '100%'
                                        }}
                                        className="h-full bg-gradient-to-r from-pink-500 to-blue-500"
                                    />
                                </div>
                                <div className="relative flex justify-between">
                                    {[
                                        { label: 'Booked', icon: Check, active: true },
                                        { label: 'Crafting', icon: Sparkles, active: ['processing', 'shipped', 'delivered'].includes(order.status) },
                                        { label: 'Shipped', icon: Truck, active: ['shipped', 'delivered'].includes(order.status) },
                                        { label: 'Arrived', icon: Package, active: order.status === 'delivered' }
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${step.active ? 'bg-white text-pink-500 scale-110 z-10 border-2 border-pink-50' : 'bg-gray-50 text-gray-300'}`}>
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${step.active ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-12 p-6 rounded-2xl bg-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <p className="text-xs font-bold text-gray-500">Estimated Magical Arrival:</p>
                                </div>
                                <p className="font-black text-gray-900">{formatDate(order.estimatedDeliveryDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Next Steps & Total */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-bl-full blur-2xl"></div>
                            <h2 className="text-lg font-black mb-8">Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>{currencySymbol}{order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className={order.shippingCost === 0 ? 'text-pink-400' : ''}>
                                        {order.shippingCost === 0 ? 'FREE' : `${currencySymbol}${order.shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Tax</span>
                                    <span>{currencySymbol}{order.tax.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-xs font-black text-emerald-400 uppercase tracking-widest">
                                        <span>Discount</span>
                                        <span>-{currencySymbol}{order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="pt-8 border-t border-white/10">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Total Paid</p>
                                <p className="text-4xl font-black">{currencySymbol}{order.total.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Need Help?</h3>
                            <div className="space-y-4">
                                <button onClick={() => window.print()} className="w-full h-14 flex items-center justify-between px-6 rounded-2xl bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition">
                                    <span className="flex items-center gap-3"><Printer className="w-4 h-4 text-gray-400" /> Print Receipt</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <Link to="/support" className="w-full h-14 flex items-center justify-between px-6 rounded-2xl bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition">
                                    <span className="flex items-center gap-3"><MessageSquare className="w-4 h-4 text-gray-400" /> Support Team</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link to="/books" className="w-full h-14 flex items-center justify-between px-6 rounded-2xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition shadow-lg shadow-gray-200">
                                    <span className="flex items-center gap-3"><ShoppingBag className="w-4 h-4" /> Keep Exploring</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.5rem] p-8 text-white text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h4 className="font-black text-lg mb-2">Check your inbox!</h4>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest leading-relaxed">
                                We've sent your receipt and tracking link to your email.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none; }
                }
            ` }} />
        </div>
    );
}
