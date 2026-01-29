import { Link } from 'react-router-dom';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import { Star, ChevronRight, Sparkles, Gift } from 'lucide-react';
import { ImageWithFallback } from '@components/figma/ImageWithFallback';

const books = [
  {
    id: 1,
    title: 'Story of a Special Boy',
    description: 'A custom adventure featuring your child as the hero',
    price: 36.00,
    oldPrice: 40.00,
    image: 'https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    badge: '-10% OFF',
    ageRange: '3-12 years'
  },
  {
    id: 2,
    title: 'Magic Forest Adventure',
    description: 'Journey through enchanted lands with your name',
    price: 36.00,
    oldPrice: 40.00,
    image: 'https://images.unsplash.com/photo-1732811798242-6d31a6164660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    badge: 'NEW',
    ageRange: '5-10 years'
  },
  {
    id: 3,
    title: 'Space Explorer',
    description: 'Your child explores the universe in this adventure',
    price: 36.00,
    oldPrice: 40.00,
    image: 'https://images.unsplash.com/photo-1768159904119-297a25a08c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    badge: 'BESTSELLER',
    ageRange: '4-11 years'
  }
];

const gifts = [
  {
    id: 101,
    title: 'Custom Story Purse',
    description: 'Featuring your child\'s favorite character',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1535556261192-f718879e7f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Compact with two columns */}
        <section className="bg-gradient-to-br from-blue-500 via-purple-400 to-pink-400 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Left: Text Content */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Create Magical Stories<br />
                  Starring Your Child
                </h1>
                <p className="text-blue-50 text-base mb-4 max-w-md">
                  Personalized AI storybooks with beautiful illustrations. Make your child the hero of their own adventure.
                </p>

                {/* Stats in compact row */}
                <div className="flex gap-6 mb-6">
                  <div>
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm text-blue-50">Unique Stories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">10k+</div>
                    <div className="text-sm text-blue-50">Happy Families</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-2xl font-bold">4.9</div>
                    <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                    <div className="text-sm text-blue-50 ml-1">Rating</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link to="/books" className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition text-sm">
                    Browse Books
                  </Link>
                  <Link to="/books?category=gifts" className="border-2 border-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition text-sm">
                    View Gifts
                  </Link>
                </div>
              </div>

              {/* Right: Book Preview Image */}
              <div className="relative">
                <div className="relative mx-auto w-64 h-80 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                    alt="Personalized storybook"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Sparkles className="absolute top-4 right-8 w-8 h-8 text-amber-300 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Two-column layout for Bestsellers and New Releases */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bestsellers Column */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Bestsellers</h2>
                <Link to="/books" className="text-sm text-pink-600 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {books.slice(0, 2).map((book) => (
                  <div key={book.id} className="bg-white rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition">
                    <Link to={`/product/${book.id}`} className="flex-shrink-0">
                      <ImageWithFallback
                        src={book.image}
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link to={`/product/${book.id}`}>
                          <h3 className="font-semibold text-sm hover:text-pink-600 transition">{book.title}</h3>
                        </Link>
                        {book.badge && (
                          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full flex-shrink-0">
                            {book.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{book.description}</p>
                      <p className="text-xs text-gray-500 mb-3">Ages {book.ageRange}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-pink-600">${book.price}</span>
                          <span className="text-sm text-gray-400 line-through ml-2">${book.oldPrice}</span>
                        </div>
                        <Link
                          to={`/personalize/${book.id}`}
                          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:from-pink-600 hover:to-blue-600 transition"
                        >
                          Personalize
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* New Releases Column */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">New Releases</h2>
                <Link to="/books" className="text-sm text-pink-600 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {books.slice(1, 3).map((book) => (
                  <div key={book.id} className="bg-white rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition">
                    <Link to={`/product/${book.id}`} className="flex-shrink-0">
                      <ImageWithFallback
                        src={book.image}
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link to={`/product/${book.id}`}>
                          <h3 className="font-semibold text-sm hover:text-pink-600 transition">{book.title}</h3>
                        </Link>
                        {book.badge && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex-shrink-0">
                            {book.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{book.description}</p>
                      <p className="text-xs text-gray-500 mb-3">Ages {book.ageRange}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-pink-600">${book.price}</span>
                          <span className="text-sm text-gray-400 line-through ml-2">${book.oldPrice}</span>
                        </div>
                        <Link
                          to={`/personalize/${book.id}`}
                          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:from-pink-600 hover:to-blue-600 transition"
                        >
                          Personalize
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Personalized Gifts - Compact Section */}
        <section className="bg-gradient-to-br from-pink-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-3">
                <Gift className="w-5 h-5 text-pink-500" />
                <span className="font-semibold text-sm">Personalized Gifts</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Complete the Experience</h2>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                Matching accessories to bring your child's story to life
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {gifts.map((gift) => (
                <div key={gift.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <ImageWithFallback
                    src={gift.image}
                    alt={gift.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-sm mb-1">{gift.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{gift.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-pink-600">${gift.price}</span>
                    <button className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:from-pink-600 hover:to-blue-600 transition">
                      Customize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Compact */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📚', title: 'Choose Your Story', description: 'Browse our collection of unique adventures' },
              { icon: '✨', title: 'Personalize Details', description: 'Add child\'s name, age, photo, and preferences' },
              { icon: '📦', title: 'Receive & Enjoy', description: 'High-quality printed book delivered to your door' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}