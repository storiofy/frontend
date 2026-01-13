# Frontend - Storiofy Clone

React.js frontend application for the Storiofy e-commerce platform.

## 🚀 Tech Stack

- **React** 18.3+
- **TypeScript** 5.3+
- **Vite** 5+ (Build tool)
- **React Router** 6+ (Routing)
- **Tailwind CSS** 3.4+ (Styling)
- **Zustand** (State management)
- **TanStack Query** (Server state)
- **React Hook Form** + **Zod** (Forms & validation)

## 📦 Installation

```bash
npm install
```

## 🏃 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🧪 Testing

Run tests:

```bash
npm test
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/              # Route pages
│   ├── components/         # React components
│   │   ├── layout/        # Header, Footer
│   │   ├── common/        # Reusable components
│   │   ├── product/       # Product components
│   │   └── auth/          # Authentication components
│   ├── lib/               # Utilities & API client
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand stores
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
└── index.html             # HTML template
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required - Backend API URL
VITE_API_URL=http://localhost:8080/api/v1

# Future - Payment gateway keys
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Map Integration (Free)

The checkout page uses **Leaflet** with **OpenStreetMap** for interactive maps:
- ✅ **Completely free** - No API key required
- ✅ **Open source** - Uses OpenStreetMap tile servers
- ✅ **Full featured**:
  - Click on map to select location
  - Drag marker to adjust position
  - Search for addresses (using Nominatim geocoding)
  - Auto-fill address fields from map selection
  - Get current GPS location

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.

## 🌐 API Integration

The frontend communicates with the Spring Boot backend at `http://localhost:8080/api/v1`.

API client is configured in `src/lib/api/client.ts`.

## 📚 Key Features

- User authentication (login, register, social login)
- Product catalog with search and filters
- Book personalization wizard
- Shopping cart
- Checkout process
- Order history
- Multi-language support

## 🔗 Related Documentation

- See `../project-architecture/PAGE_SPECIFICATIONS.md` for page details
- See `../project-architecture/REACT_CODE_EXAMPLES.md` for code examples

---

**Status:** ✅ Initialized
**Port:** 5173
**API Backend:** http://localhost:8080
