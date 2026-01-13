import { Link } from 'react-router-dom';
import FAQAccordion from '@components/support/FAQAccordion';

// FAQ data - In production, this would come from an API
const faqItems = [
    {
        id: '1',
        question: 'How long does it take to receive my personalized book?',
        answer: 'Once you complete your personalization and place your order, we typically process and ship your book within 5-7 business days. Delivery times vary by location, but most orders arrive within 2-3 weeks of ordering.',
    },
    {
        id: '2',
        question: 'Can I personalize a book for multiple children?',
        answer: 'Yes! You can create separate personalizations for each child. Simply create a new personalization for each child and add them to your cart separately.',
    },
    {
        id: '3',
        question: 'What photo requirements are there for personalization?',
        answer: 'We recommend using a clear, front-facing photo with good lighting. The photo should show the child\'s face clearly. Supported formats include JPG, PNG, and WEBP, with a maximum file size of 10MB.',
    },
    {
        id: '4',
        question: 'Can I edit my personalization after placing an order?',
        answer: 'You can edit your personalization as long as your order hasn\'t entered the printing stage. Please contact our support team at support@Storiofy.com if you need to make changes to an existing order.',
    },
    {
        id: '5',
        question: 'What languages are available?',
        answer: 'We currently support multiple languages including English, Spanish, French, German, Italian, and Portuguese. More languages are being added regularly. Check the language dropdown on each book page to see available options.',
    },
    {
        id: '6',
        question: 'How do I track my order?',
        answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also view your order status and tracking information in your account under "My Orders".',
    },
    {
        id: '7',
        question: 'What is your return policy?',
        answer: 'We want you to be completely satisfied with your personalized book. If you\'re not happy with your purchase, please contact us within 30 days of delivery for a full refund or replacement.',
    },
    {
        id: '8',
        question: 'Do you ship internationally?',
        answer: 'Yes! We ship to over 200 countries worldwide. Shipping costs and delivery times vary by location. You can select your country during checkout to see specific shipping options and costs.',
    },
];

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Support Center
                        </h1>
                        <p className="text-xl lg:text-2xl text-purple-100">
                            We're here to help you create magical personalized stories
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Quick Links */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-xl p-6 sticky top-20">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Quick Links
                            </h2>
                            <nav className="space-y-3">
                                <Link
                                    to="/support/faqs"
                                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center">
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
                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>FAQs</span>
                                    </div>
                                </Link>
                                <Link
                                    to="/support/contact"
                                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center">
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
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>Contact Us</span>
                                    </div>
                                </Link>
                                <Link
                                    to="/support/terms-and-conditions"
                                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center">
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
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        <span>Terms & Conditions</span>
                                    </div>
                                </Link>
                                <Link
                                    to="/support/privacy-policy"
                                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center">
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
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                        <span>Privacy Policy</span>
                                    </div>
                                </Link>
                                <Link
                                    to="/support/shipping"
                                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center">
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
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                        <span>Shipping Information</span>
                                    </div>
                                </Link>
                                <Link
                                    to="/support/returns"
                                    className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center">
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
                                                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m5 8h.01M19 21a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h4l2 2h4a2 2 0 012 2z"
                                            />
                                        </svg>
                                        <span>Returns & Refunds</span>
                                    </div>
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Contact Information Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Contact Us
                            </h2>
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <p className="text-gray-700 mb-6">
                                    Have a question or need assistance? We're here to help! Reach out to us through any of the following methods:
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <svg
                                            className="w-6 h-6 text-indigo-600 mr-3 mt-1 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                Email Support
                                            </h3>
                                            <a
                                                href="mailto:support@Storiofy.com"
                                                className="text-indigo-600 hover:text-indigo-700 transition-colors"
                                            >
                                                support@Storiofy.com
                                            </a>
                                            <p className="text-sm text-gray-600 mt-1">
                                                We typically respond within 24 hours
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <svg
                                            className="w-6 h-6 text-indigo-600 mr-3 mt-1 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                Response Time
                                            </h3>
                                            <p className="text-gray-700">
                                                Monday - Friday: 9 AM - 6 PM (EST)
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                We aim to respond to all inquiries within 24 hours
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <svg
                                            className="w-6 h-6 text-indigo-600 mr-3 mt-1 flex-shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                Frequently Asked Questions
                                            </h3>
                                            <p className="text-gray-700">
                                                Check out our FAQ section below for quick answers to common questions
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <FAQAccordion items={faqItems} />
                        </section>

                        {/* Additional Support Information */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Additional Resources
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    to="/support/terms-and-conditions"
                                    className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Terms & Conditions
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Read our terms of service and conditions
                                    </p>
                                </Link>
                                <Link
                                    to="/support/privacy-policy"
                                    className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Privacy Policy
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Learn how we protect your personal information
                                    </p>
                                </Link>
                                <Link
                                    to="/support/shipping"
                                    className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Shipping Information
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Delivery times, costs, and tracking information
                                    </p>
                                </Link>
                                <Link
                                    to="/support/returns"
                                    className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Returns & Refunds
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Our return policy and refund process
                                    </p>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}




