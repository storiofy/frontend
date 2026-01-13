import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import HomePage from '@pages/HomePage';
import BooksPage from '@pages/BooksPage';
import BookDetailPage from '@pages/BookDetailPage';
import PersonalizationPage from '@pages/PersonalizationPage';
import SupportPage from '@pages/SupportPage';
import BlogPage from '@pages/BlogPage';
import PrivacyPolicyPage from '@pages/PrivacyPolicyPage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import CartPage from '@pages/CartPage';
import CheckoutPage from '@pages/CheckoutPage';
import OrderConfirmationPage from '@pages/OrderConfirmationPage';
import ProfilePage from '@pages/ProfilePage';

// Layout Components
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';

// Store
import { useAuthStore } from '@store/authStore';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const initializeFromStorage = useAuthStore((state) => state.initializeFromStorage);

  useEffect(() => {
    // Initialize auth state from localStorage on app load
    initializeFromStorage();
  }, [initializeFromStorage]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:slug" element={<BookDetailPage />} />
            <Route path="/books/:slug/personalise" element={<PersonalizationPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/support/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
