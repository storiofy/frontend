import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated } = useAuthStore();

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // TODO: Implement newsletter subscription API call
        setTimeout(() => {
            setIsSubmitting(false);
            setEmail('');
            alert('Thank you for subscribing!');
        }, 500);
    };

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Left Section - Storiofy Info */}
                    <div className="lg:col-span-1">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-fuchsia-500 to-indigo-500 rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                                <img
                                    src="/logo.png"
                                    alt="Storiofy Logo"
                                    className="relative w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-vibrant-brand">
                                Storiofy
                            </span>
                        </Link>

                        {/* Description */}
                        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                            Create magical personalized storybooks that make your children the hero of their own adventure.
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                                aria-label="Facebook"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                                aria-label="Instagram"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                                aria-label="Twitter"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    <span>Contact Us</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/team"
                                    className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    <span>Our Team</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    <span>Blog</span>
                                </Link>
                            </li>
                            {!isAuthenticated && (
                                <>
                                    <li>
                                        <Link
                                            to="/login"
                                            className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            <span>Login</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/register"
                                            className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            <span>Sign Up</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Customer Area */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Customer Area</h3>
                        <ul className="space-y-3">
                            {isAuthenticated && (
                                <>
                                    <li>
                                        <Link
                                            to="/profile"
                                            className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            <span>My Account</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/orders"
                                            className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            <span>Orders</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    <span>Terms of Service</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    <span>Privacy Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/support"
                                    className="text-sm text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    <span>Support</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Stay Updated</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Subscribe to our newsletter for exclusive offers and updates.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 text-sm bg-gray-700 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                            </button>
                        </form>

                        {/* Payment Methods */}
                        <div className="mt-8">
                            <p className="text-xs text-gray-400 mb-3">We accept:</p>
                            <div className="flex flex-wrap gap-2">
                                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                                    <span className="text-white text-xs font-bold">VISA</span>
                                </div>
                                <div className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
                                    <span className="text-white text-xs font-bold">MC</span>
                                </div>
                                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                    <span className="text-white text-xs font-bold">AMEX</span>
                                </div>
                                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg">
                                    <span className="text-white text-xs font-bold">PayPal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Copyright */}
                <div className="border-t border-gray-700 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} Storiofy. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
                                Privacy
                            </Link>
                            <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                                Terms
                            </Link>
                            <Link to="/support" className="hover:text-indigo-400 transition-colors">
                                Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
