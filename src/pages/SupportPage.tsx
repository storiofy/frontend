import {
    Mail,
    Clock,
    HelpCircle,
    FileText,
    Shield,
    Truck,
    RotateCcw,
    ChevronDown,
    ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportPage() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const faqs = [
        {
            question: 'How long does it take to receive my personalized book?',
            answer: 'Once you complete personalization and place your order, we typically process and ship your book within 5-7 business days. Delivery times vary by location, but most orders arrive within 2-3 weeks. You can also view order status and tracking information in your account under "My Orders".'
        },
        {
            question: 'Can I personalize a book for multiple children?',
            answer: 'Yes! You can create separate personalizations for each child. Simply select a new personalization for each child and add them to your cart separately. We also offer special sibling-themed stories where both children can star together in the same book.'
        },
        {
            question: 'What photo requirements are there for personalization?',
            answer: 'For best results, we recommend uploading a clear, front-facing photo with good lighting. The photo should show the child\'s face clearly. Supported formats include JPG, PNG, and WEBP, with a maximum file size of 10MB.'
        },
        {
            question: 'Can I edit my personalization after placing an order?',
            answer: 'Yes, you can still edit personalization up to 24 hours after placing the order. Please visit your order in your account page or contact our support team at support@storiofy.com if you need to make changes to an existing order.'
        },
        {
            question: 'What languages are available?',
            answer: 'We currently support multiple languages including English, Spanish, French, German, Italian, and Chinese. You can select your preferred language during checkout. Check the language dropdown on each book page to see available options for that specific story.'
        },
        {
            question: 'How do I track my order?',
            answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also view order status and tracking information in your account under "My Orders".'
        },
        {
            question: 'What is your return policy?',
            answer: 'We want you to be completely satisfied with your personalized book. If you\'re not happy with your purchase, please contact us verify at +1 800-555-0123 or via refund via a full refund or replacement.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'Yes! We ship to over 200 countries worldwide. Storiofy.com\'s delivery times vary by location. You can select your country during checkout to see available shipping options and estimated delivery times for your specific area.'
        }
    ];

    const quickLinks = [
        { icon: HelpCircle, title: 'FAQs', description: 'Find quick answers to common questions', link: '#faq' },
        { icon: FileText, title: 'Terms & Conditions', description: 'Read our terms of service and conditions', link: '#terms' },
        { icon: Shield, title: 'Privacy Policy', description: 'Learn how we protect your information', link: '#privacy' },
        { icon: Truck, title: 'Shipping Information', description: 'View rates, times, and tracking information', link: '#shipping' },
        { icon: RotateCcw, title: 'Returns & Refunds', description: 'Info on our return policy and refunds', link: '#returns' }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-500 via-purple-400 to-pink-400 text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Support Center</h1>
                    <p className="text-blue-50 text-base max-w-2xl mx-auto">
                        We're here to help you create magical personalized stories
                    </p>
                </div>
            </section>

            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
                {/* Contact Us Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
                    <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Have a question or need assistance? We're here to help! Reach out to us through any of the following methods:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Email Support */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">Email Support</h3>
                                <p className="text-xs text-gray-600 mb-2">support@storiofy.com</p>
                                <p className="text-xs text-gray-500">We typically respond within 24 hours</p>
                            </div>
                        </div>

                        {/* Response Time */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">Response Time</h3>
                                <p className="text-xs text-gray-600 mb-2">Monday - Friday: 9 AM - 6 PM (EST)</p>
                                <p className="text-xs text-gray-500">We aim to respond to all queries within 24 hours</p>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">Frequently Asked Questions</h3>
                                <p className="text-xs text-gray-600 mb-2">Check out our FAQ page for quick answers to common questions</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickLinks.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-pink-200 transition">
                                        <item.icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div id="faq" className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                                >
                                    <span className="font-semibold text-sm pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFAQ === index ? 'transform rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFAQ === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden border-t"
                                        >
                                            <div className="px-5 py-4 text-sm text-gray-600">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Resources */}
                <div className="bg-gradient-to-br from-blue-50 to-pink-50 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">Additional Resources</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-sm mb-3">Terms & Conditions</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                Read our terms of service and conditions
                            </p>
                            <a
                                href="#terms"
                                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                View Terms <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm mb-3">Privacy Policy</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                Learn how we protect your information
                            </p>
                            <a
                                href="#privacy"
                                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                View Privacy Policy <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm mb-3">Shipping Information</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                View rates, times, and tracking information
                            </p>
                            <a
                                href="#shipping"
                                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                Shipping Details <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm mb-3">Returns & Refunds</h3>
                            <p className="text-xs text-gray-600 mb-3">
                                Info on our return policy and refunds
                            </p>
                            <a
                                href="#returns"
                                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                                Return Policy <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
