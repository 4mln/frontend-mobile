# B2B Marketplace Frontend (v2.1)

A modern, mobile-first React Native + Expo application for B2B marketplace with Divar-inspired UI/UX, built for the Iranian market with Persian RTL support and global expansion capabilities.

## 🎯 Features

### Core Features (MVP)
- **Guild-based Organization**: Industry-specific product categories
- **OTP Authentication**: Phone-based authentication with Persian UI
- **Product Listings**: Card-based product display with Divar-inspired design
- **Search & Filters**: Advanced filtering with bottom sheet UI
- **RFQ System**: Request for Quote functionality
- **In-app Chat**: Real-time messaging with attachments
- **Wallet Integration**: Transaction management and payment processing
- **Multi-language Support**: Persian (RTL) and English (LTR)

### Technical Features
- **Cross-platform**: iOS, Android, and Web (PWA)
- **TypeScript**: Full type safety
- **State Management**: Zustand for global state
- **API Integration**: React Query for server state
- **Internationalization**: i18next with RTL support
- **Theme System**: Dark/Light mode with Divar-inspired colors
- **Responsive Design**: Mobile-first with tablet support

## 🛠️ Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **API Client**: React Query + Axios
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Internationalization**: i18next + react-i18next
- **Icons**: Expo Vector Icons (Ionicons)
- **Storage**: Expo SecureStore
- **Testing**: Jest + Detox (E2E)

## 📱 Screenshots

### Home Screen
- Guild categories with horizontal scroll
- Recommended and trending products
- Pull-to-refresh functionality

### Search & Filters
- Advanced filtering with bottom sheet
- Sort options (newest, price, popularity)
- Real-time search results

### Product Details
- Image carousel with indicators
- Detailed specifications
- Seller information
- Action buttons (Request Quote, Contact)

### Chat System
- Conversation list with unread indicators
- Real-time messaging
- Attachment support

### Profile & Wallet
- User profile management
- Wallet balance and transactions
- Settings and preferences

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- **Backend**: B2B Marketplace backend running at `c:\b2b-marketplace`
- Docker (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd b2b-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the backend services**
   ```bash
   # Start backend (API, Database, Redis, RabbitMQ)
   npm run backend:start
   
   # Or manually:
   cd c:\b2b-marketplace
   docker-compose up -d
   ```

4. **Test backend connection**
   ```bash
   npm run backend:test
   ```

5. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   
   # Or start both backend and frontend
   npm run dev:full
   ```

6. **Run on specific platforms**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure API endpoints**
   ```env
   API_BASE_URL=http://localhost:8000
   API_TIMEOUT=10000
   ```

## 📁 Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   │   ├── api.ts     # API calls
│   │   ├── hooks.ts   # React hooks
│   │   ├── store.ts   # Zustand store
│   │   └── types.ts   # TypeScript types
│   ├── products/      # Product management
│   ├── chat/          # Chat functionality
│   └── wallet/        # Wallet operations
├── components/         # Reusable components
│   ├── ui/            # UI components
│   ├── ProductCard.tsx
│   ├── GuildCard.tsx
│   └── FilterBottomSheet.tsx
├── theme/             # Theme system
│   ├── colors.ts      # Color palette
│   ├── typography.ts  # Font system
│   ├── spacing.ts     # Spacing scale
│   └── index.ts       # Theme exports
├── i18n/              # Internationalization
│   ├── index.ts       # i18n configuration
│   └── locales/       # Translation files
│       ├── en.json    # English translations
│       └── fa.json    # Persian translations
├── services/          # API service modules
│   ├── api.ts         # Axios instance configuration
│   ├── auth.ts        # Authentication services
│   ├── chat.ts        # Chat and messaging services
│   ├── product.ts     # Product management services
│   ├── rfq.ts         # Request for Quote services
│   ├── wallet.ts      # Wallet and payment services
│   ├── index.ts       # Centralized exports
│   └── README.md      # Services documentation
└── hooks/             # Custom hooks
    ├── use-color-scheme.ts
    └── use-theme-color.ts

app/                   # Expo Router pages
├── (tabs)/           # Tab navigation
│   ├── index.tsx     # Home screen
│   ├── search.tsx    # Search screen
│   ├── add.tsx       # Add product/RFQ
│   ├── chat.tsx      # Chat list
│   └── profile.tsx   # Profile screen
├── auth/             # Authentication screens
│   ├── login.tsx     # Phone number input
│   └── verify-otp.tsx # OTP verification
├── product/          # Product screens
│   └── [id].tsx      # Product detail
└── _layout.tsx       # Root layout
```

## 🎨 Design System

### Color Palette
- **Primary**: Divar-inspired orange (#f97316)
- **Secondary**: Professional blue (#3b82f6)
- **Neutral**: Gray scale for text and backgrounds
- **Status**: Success, warning, error colors

### Typography
- **Persian**: Vazir font family
- **English**: Inter font family
- **Responsive**: Size scale from 12px to 48px

### Spacing
- **Grid System**: 4px base unit
- **Semantic**: xs, sm, md, lg, xl, 2xl, 3xl
- **Component-specific**: card, button, input padding

## 🌐 Internationalization

### Supported Languages
- **Persian (fa)**: RTL layout with Vazir font
- **English (en)**: LTR layout with Inter font

### Adding New Languages
1. Create translation file in `src/i18n/locales/`
2. Add language configuration in `src/i18n/index.ts`
3. Update language selector in profile screen

### RTL Support
- Automatic layout direction based on language
- RTL-aware components and styling
- Persian number formatting

## 🔐 Authentication

### OTP Flow
1. **Phone Input**: User enters phone number
2. **OTP Send**: Server sends verification code
3. **OTP Verify**: User enters 6-digit code
4. **Token Storage**: Secure token storage with Expo SecureStore

### Protected Routes
- Authentication state managed with Zustand
- Automatic route protection based on auth status
- Token refresh handling

## 📡 API Integration

### API Client
- Axios-based HTTP client
- Automatic token attachment
- Request/response interceptors
- Error handling and retry logic

### React Query
- Server state management
- Caching and background updates
- Optimistic updates
- Error boundaries

### Endpoints
- **Auth**: `/otp/request`, `/otp/verify`, `/me`, `/me/profile`
- **Products**: `/products`, `/products/search`
- **Guilds**: `/guilds`, `/guilds/{id}/products`
- **Chat**: `/chat/conversations`, `/chat/messages`
- **Wallet**: `/wallet/balance`, `/wallet/transactions`

### Backend Connection
- **Backend URL**: `http://localhost:8000` (development)
- **API Documentation**: `http://localhost:8000/api/docs`
- **Health Check**: `http://localhost:8000/health`
- **CORS**: Configured for frontend development

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Structure
- **Unit**: Component and utility function tests
- **Integration**: Feature and API integration tests
- **E2E**: Full user journey tests

## 🚀 Deployment

### All Platforms
```bash
# Deploy to all platforms (Android, iOS, Web)
npm run deploy:all

# Or deploy individually
npm run deploy:mobile  # Android + iOS
npm run deploy:web     # Web/PWA
```

### Mobile Apps

#### iOS
```bash
# Build for iOS
npm run build:ios

# Submit to App Store
eas submit --platform ios
```

#### Android
```bash
# Build for Android
npm run build:android

# Submit to Google Play
eas submit --platform android
```

### Web/PWA
```bash
# Build for web
npm run build:web

# Deploy to hosting service
npm run deploy:web
```

### Platform-Specific Features

#### Mobile Apps
- **Android**: APK/AAB builds, Google Play Store
- **iOS**: IPA builds, Apple App Store
- **Native Features**: Camera, GPS, Push notifications

#### Web App
- **PWA**: Offline support, installable, push notifications
- **SEO**: Optimized for search engines
- **Responsive**: Works on desktop, tablet, mobile
- **Performance**: Fast loading, caching, service worker

### Environment Configuration
- **Development**: Local API endpoints
- **Staging**: Staging server endpoints
- **Production**: Production API endpoints

## 🔧 Configuration

### Backend Connection
- **API Configuration**: `src/config/api.ts`
- **Backend URL**: `http://localhost:8000` (development)
- **Connection Test**: `npm run backend:test`
- **Setup Script**: `node scripts/setup-backend-connection.js`

### Expo Configuration
- **app.json**: App metadata and build configuration
- **eas.json**: EAS Build and Submit configuration
- **metro.config.js**: Metro bundler configuration

### Build Configuration
- **iOS**: Bundle identifier, provisioning profiles
- **Android**: Package name, signing keys
- **Web**: PWA manifest, service worker

## 📊 Performance

### Optimization Strategies
- **Lazy Loading**: Component and route-based code splitting
- **Image Optimization**: Expo Image with caching
- **Bundle Analysis**: Metro bundle analyzer
- **Memory Management**: Proper cleanup and garbage collection

### Monitoring
- **Crash Reporting**: Expo Application Services
- **Analytics**: Custom analytics implementation
- **Performance**: React Native Performance Monitor

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Expo recommended rules
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### Pull Request Process
1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update version numbers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [Backend Connection Setup](BACKEND_CONNECTION.md)
- [Deployment Guide](DEPLOYMENT.md)

### Community
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://github.com/react-native-community)

### Issues
- Report bugs via GitHub Issues
- Request features via GitHub Discussions
- Security issues: email security@company.com

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core MVP features
- ✅ Authentication system
- ✅ Basic product listings
- ✅ Search and filters

### Phase 2 (Next)
- 🔄 Advanced chat features
- 🔄 Payment integration
- 🔄 Push notifications
- 🔄 Offline support

### Phase 3 (Future)
- 📋 Multi-currency support
- 📋 Advanced analytics
- 📋 AI-powered recommendations
- 📋 Video product showcases

---

**Built with ❤️ for the B2B marketplace community**
