import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';

export default function Header() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const items = useCartStore((state) => state.items);
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const navigate = useNavigate();
    const location = useLocation();
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

    // Handle scroll for header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <header
            className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 ${isScrolled ? 'py-2 shadow-md' : 'py-3'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo & Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-fuchsia-500 to-indigo-500 rounded-xl opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                            <img
                                src="/logo.png"
                                alt="Storiofy Logo"
                                className="relative w-11 h-11 object-contain transform group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-vibrant-brand">
                            Storiofy
                        </span>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className={`text-sm font-semibold transition-colors relative group ${isActive('/')
                                ? 'text-indigo-600'
                                : 'text-gray-700 hover:text-indigo-600'
                                }`}
                        >
                            Home
                            {isActive('/') && (
                                <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600"></span>
                            )}
                        </Link>
                        <Link
                            to="/books"
                            className={`text-sm font-semibold transition-colors relative group ${isActive('/books')
                                ? 'text-indigo-600'
                                : 'text-gray-700 hover:text-indigo-600'
                                }`}
                        >
                            Books
                            {isActive('/books') && (
                                <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600"></span>
                            )}
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/my-books"
                                className={`text-sm font-semibold transition-colors relative group ${isActive('/my-books')
                                    ? 'text-indigo-600'
                                    : 'text-gray-700 hover:text-indigo-600'
                                    }`}
                            >
                                My Books
                                {isActive('/my-books') && (
                                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600"></span>
                                )}
                            </Link>
                        )}
                        <Link
                            to="/support"
                            className={`text-sm font-semibold transition-colors relative group ${isActive('/support')
                                ? 'text-indigo-600'
                                : 'text-gray-700 hover:text-indigo-600'
                                }`}
                        >
                            Support
                            {isActive('/support') && (
                                <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia-600 to-indigo-600"></span>
                            )}
                        </Link>
                    </nav>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-3">
                        {/* Currency/Language Selector */}
                        <div className="hidden sm:block relative" ref={currencyMenuRef}>
                            <button
                                onClick={() => {
                                    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                                    setIsUserMenuOpen(false);
                                }}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                                aria-label="Currency selector"
                            >
                                <span>USD</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isCurrencyMenuOpen ? 'transform rotate-180' : ''
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

                            {/* Currency Dropdown */}
                            {isCurrencyMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                                        Currency
                                    </div>
                                    <button
                                        onClick={() => setIsCurrencyMenuOpen(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        USD - US Dollar
                                    </button>
                                    <button
                                        onClick={() => setIsCurrencyMenuOpen(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        EUR - Euro
                                    </button>
                                    <button
                                        onClick={() => setIsCurrencyMenuOpen(false)}
                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        GBP - British Pound
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Search Icon */}
                        <button
                            className="p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label="Search"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>

                        {/* Cart Icon with Badge */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label="Shopping cart"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </Link>

                        {/* User Account Icon/Dropdown */}
                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(!isUserMenuOpen);
                                        setIsCurrencyMenuOpen(false);
                                    }}
                                    className="p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    aria-label="User menu"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </button>

                                {/* User Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user?.firstName} {user?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to="/my-books"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span>My Books</span>
                                        </Link>
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <span>Orders</span>
                                        </Link>
                                        {user?.isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>Admin Portal</span>
                                            </Link>
                                        )}
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                                aria-label="Login"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label="Menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 py-4">
                        <nav className="flex flex-col gap-2">
                            <Link
                                to="/"
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive('/')
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/books"
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive('/books')
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Books
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to="/my-books"
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive('/my-books')
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    My Books
                                </Link>
                            )}
                            <Link
                                to="/support"
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${isActive('/support')
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Support
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
