import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import { useCurrencyStore } from '@store/currencyStore';
import { SUPPORTED_CURRENCIES } from '@lib/utils/currency';
import type { CurrencyCode } from '@lib/utils/currency';
import { useQueryClient } from '@tanstack/react-query';
import Logo from './Logo';

export default function Header() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const items = useCartStore((state) => state.items);
    const { currency, setCurrency } = useCurrencyStore();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const userMenuRef = useRef<HTMLDivElement>(null);
    const currencyMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
                setIsCurrencyMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const handleCurrencyChange = (code: CurrencyCode) => {
        setCurrency(code);
        setIsCurrencyMenuOpen(false);
        queryClient.invalidateQueries({ queryKey: ['books'] });
        queryClient.invalidateQueries({ queryKey: ['book'] });
        queryClient.invalidateQueries({ queryKey: ['newReleases'] });
        queryClient.invalidateQueries({ queryKey: ['bestsellers'] });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['shipping-options'] });
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Books', path: '/books' },
        { name: 'Gifts', path: '/gifts' },
        { name: 'Support', path: '/support' },
    ];

    return (
        <header className="sticky top-0 z-50 border-b bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <Logo />
                        <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Storiofy</span>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-6 text-sm">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`hover:text-pink-500 transition-colors ${location.pathname === link.path ? 'text-pink-600 font-medium' : 'text-gray-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Link
                                to="/my-books"
                                className={`hover:text-pink-500 transition-colors ${location.pathname === '/my-books' ? 'text-pink-600 font-medium' : 'text-gray-600'
                                    }`}
                            >
                                My Books
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Currency Selector */}
                        <div className="relative" ref={currencyMenuRef}>
                            <button
                                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 hover:bg-gray-100 rounded-md transition text-sm font-bold text-gray-700"
                            >
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-500">{SUPPORTED_CURRENCIES[currency].symbol}</span>
                                {currency}
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                            </button>
                            {isCurrencyMenuOpen && (
                                <div className="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg py-1 z-50">
                                    {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => (
                                        <button
                                            key={code}
                                            onClick={() => handleCurrencyChange(code)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${currency === code ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-700'
                                                }`}
                                        >
                                            {SUPPORTED_CURRENCIES[code].symbol} {code}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <button className="p-2 hover:bg-gray-100 rounded-md transition text-gray-600">
                            <Search className="w-4 h-4" />
                        </button>

                        {/* User Profile */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => {
                                    if (isAuthenticated) {
                                        setIsUserMenuOpen(!isUserMenuOpen);
                                    } else {
                                        navigate('/login');
                                    }
                                }}
                                className="p-2 hover:bg-gray-100 rounded-md transition text-gray-600"
                            >
                                <User className="w-4 h-4" />
                            </button>
                            {isAuthenticated && isUserMenuOpen && (
                                <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-xs font-semibold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                                        <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>Profile</Link>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>Orders</Link>
                                    {user?.isAdmin && (
                                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>Admin Portal</Link>
                                    )}
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-md transition relative text-gray-600">
                            <ShoppingCart className="w-4 h-4" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition text-gray-600"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 text-sm rounded-md transition-colors ${location.pathname === link.path ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <Link
                                    to="/my-books"
                                    className={`px-4 py-2 text-sm rounded-md transition-colors ${location.pathname === '/my-books' ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    My Books
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
