import { useState } from 'react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        id: '1',
        question: 'How do I place an order?',
        answer: 'To place an order, simply browse our collection, select a book, click "Personalise", and follow the customization steps. Add the personalized book to your cart and proceed to checkout.',
    },
    {
        id: '2',
        question: 'Do you ship to my location?',
        answer: 'We ship to over 200 countries worldwide! During checkout, you can select your country and we will calculate shipping costs and delivery times for your location.',
    },
    {
        id: '3',
        question: 'How long does shipping take?',
        answer: 'Shipping times vary by location. Standard shipping typically takes 7-14 business days, while express shipping takes 3-7 business days. You will receive a tracking number once your order ships.',
    },
    {
        id: '4',
        question: 'Will I have to pay duties or extra fees?',
        answer: 'Duties and taxes depend on your country\'s import regulations. We are not responsible for any customs fees, duties, or taxes that may be charged by your local customs office. These charges are the customer\'s responsibility.',
    },
    {
        id: '5',
        question: 'What if I\'m not happy with my order?',
        answer: 'We want you to be completely satisfied! If you\'re not happy with your order, please contact our customer service team within 30 days of delivery, and we\'ll work with you to resolve the issue.',
    },
    {
        id: '6',
        question: 'Can I get a refund for my order?',
        answer: 'Yes, we offer refunds for orders that meet our return policy requirements. Items must be returned in their original condition within 30 days of delivery. Please contact customer service to initiate a return.',
    },
    {
        id: '7',
        question: 'How can I reach customer support?',
        answer: 'You can reach our customer support team by email at support@Storiofy.com, through our contact form, or by using the chat widget on our website. We typically respond within 24 hours.',
    },
    {
        id: '8',
        question: 'What languages are your books available in?',
        answer: 'Our books are available in multiple languages including English, Spanish, French, German, Italian, Portuguese, and more. You can select your preferred language during the personalization process.',
    },
];

export default function FAQSection() {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set(['1'])); // First item open by default

    const toggleItem = (id: string) => {
        setOpenItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqData.map((faq) => {
                        const isOpen = openItems.has(faq.id);
                        return (
                            <div
                                key={faq.id}
                                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Question */}
                                <button
                                    onClick={() => toggleItem(faq.id)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${faq.id}`}
                                >
                                    <span className="text-lg font-semibold text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                                            isOpen ? 'transform rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Answer */}
                                <div
                                    id={`faq-answer-${faq.id}`}
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-6 py-4 bg-gray-50 text-gray-700 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}




