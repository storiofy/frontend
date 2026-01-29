import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-3">Company</h3>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/team" className="hover:text-white transition-colors">Our Team</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    {/* Customer Area */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-3">Customer Area</h3>
                        <ul className="space-y-2 text-xs">
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Stay Updated */}
                    <div className="col-span-2">
                        <h3 className="text-white font-semibold text-sm mb-3">Stay Updated</h3>
                        <p className="text-xs mb-3">Subscribe to our newsletter for exclusive offers</p>
                        <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-xs focus:outline-none focus:border-pink-500 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-pink-600 text-white px-4 py-2 rounded-md text-xs font-semibold hover:from-blue-700 hover:to-pink-700 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? '...' : 'Subscribe'}
                            </button>
                        </form>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs">© {new Date().getFullYear()} Storiofy. All rights reserved.</p>
                    <div className="flex gap-4 text-xs">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/support" className="hover:text-white transition-colors">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
