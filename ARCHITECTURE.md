# Uplet - Professional Architecture

## 🏗️ Architecture Overview

This document outlines the professional, scalable architecture implemented for the Uplet React Native application. The structure follows industry best practices for maintainability, scalability, and team collaboration.

## 📁 Directory Structure

```
src/
├── app/                           # Application-level configuration
│   ├── components/               # App-level components (Navigation, Layout)
│   │   ├── AppNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   ├── OwnerBottomTabNavigator.tsx
│   │   ├── OwnerStack.tsx
│   │   ├── RenterStack.tsx
│   │   └── index.ts
│   ├── constants/                # App constants and design tokens
│   │   ├── tokens.ts            # Design system tokens
│   │   ├── locations.ts         # Location constants
│   │   └── index.ts
│   ├── config/                  # App configuration and mock data
│   │   ├── mockApartments.ts
│   │   └── index.ts
│   ├── assets/                  # App assets (icons, images)
│   │   ├── icons/
│   │   ├── icon.png
│   │   ├── splash-icon.png
│   │   └── ...
│   └── index.ts
├── core/                         # Core business logic
│   ├── services/                # State management and API services
│   │   ├── authStore.ts
│   │   ├── bookingsStore.ts
│   │   ├── chatStore.ts
│   │   ├── favoritesStore.ts
│   │   ├── listingsStore.ts
│   │   ├── requestStore.ts
│   │   ├── filterStore.ts
│   │   ├── FavoritesTabContext.tsx
│   │   ├── authApi.ts
│   │   ├── authService.ts
│   │   ├── bookingApi.ts
│   │   ├── chatApi.ts
│   │   ├── listingApi.ts
│   │   ├── paymentApi.ts
│   │   ├── paymentService.ts
│   │   ├── requestApi.ts
│   │   └── index.ts
│   ├── types/                   # Core type definitions
│   │   ├── booking.ts
│   │   ├── listing.ts
│   │   ├── request.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── utils/                   # Core utilities
│   │   ├── storage.ts
│   │   ├── formatting/
│   │   ├── helpers/
│   │   ├── validation/
│   │   └── index.ts
│   └── index.ts
├── shared/                       # Shared resources
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ... (25+ components)
│   │   │   └── index.ts
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── index.ts
│   ├── hooks/                  # Shared hooks
│   │   ├── api/
│   │   ├── state/
│   │   ├── ui/
│   │   └── index.ts
│   ├── services/               # Shared services
│   │   ├── api/
│   │   ├── storage/
│   │   └── index.ts
│   ├── types/                  # Shared types
│   │   ├── api/
│   │   ├── domain/
│   │   └── index.ts
│   ├── utils/                  # Shared utilities
│   │   ├── formatting/
│   │   ├── helpers/
│   │   ├── validation/
│   │   └── index.ts
│   └── index.ts
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── screens/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── apartments/             # Apartment management (Owner)
│   │   ├── screens/
│   │   │   ├── EditApartmentScreen.tsx
│   │   │   ├── InterestedRentersScreen.tsx
│   │   │   ├── OwnerChatScreen.tsx
│   │   │   ├── OwnerDashboardScreen.tsx
│   │   │   ├── OwnerHomeScreen.tsx
│   │   │   ├── OwnerProfileScreen.tsx
│   │   │   ├── PaymentsScreen.tsx
│   │   │   ├── RenterRequestsScreen.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── ProfileActionItem.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyStory.tsx
│   │   │   ├── RenterCard.tsx
│   │   │   └── index.ts
│   │   ├── addProperty/        # Property creation flow
│   │   │   ├── AddPropertyScreen.tsx
│   │   │   ├── components/
│   │   │   ├── steps/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── bookings/               # Booking management
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── chat/                   # Chat functionality
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── favorites/              # Favorites feature
│   │   ├── screens/
│   │   │   ├── ChatDetailScreen.tsx
│   │   │   ├── ChatListScreen.tsx
│   │   │   ├── MakeRequestBottomSheet.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── AreaStoriesHeader.tsx
│   │   │   ├── AreaStoryCard.tsx
│   │   │   ├── ChatListItem.tsx
│   │   │   ├── RequestButton.tsx
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── areaUtils.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   ├── profile/                # User profile
│   │   ├── screens/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   └── swipe/                  # Swipe discovery feature
│       ├── screens/
│       │   ├── AreaDetailsScreen.tsx
│       │   ├── BookingScreen.tsx
│       │   ├── ChatScreen.tsx
│       │   ├── FavoritesScreen.tsx
│       │   ├── FavoritesTabScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   ├── ListingDetailsScreen.tsx
│       │   ├── MyBookingsScreen.tsx
│       │   ├── SwipeDiscoveryScreen.tsx
│       │   └── index.ts
│       ├── components/
│       │   ├── FilterBottomSheet.tsx
│       │   ├── FloatingActionButtons.tsx
│       │   ├── HeroCarousel.tsx
│       │   ├── HomeHeader.tsx
│       │   ├── ListingsSection.tsx
│       │   ├── QuickFilters.tsx
│       │   ├── SwipeCard.tsx
│       │   ├── SwipeEmptyState.tsx
│       │   ├── SwipeStack.tsx
│       │   └── index.ts
│       ├── services/
│       │   ├── mockData.ts
│       │   └── index.ts
│       ├── types/
│       │   ├── FilterData.ts
│       │   └── index.ts
│       ├── utils/
│       │   └── index.ts
│       └── index.ts
└── index.ts                     # Main application exports
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**

- **App Layer**: Application configuration, navigation, and global setup
- **Core Layer**: Business logic, state management, and API services
- **Shared Layer**: Reusable components, utilities, and common functionality
- **Features Layer**: Feature-specific screens, components, and logic

### 2. **Feature-Based Organization**

Each feature is self-contained with:

- `screens/` - Feature-specific screens
- `components/` - Feature-specific components
- `services/` - Feature-specific services and API calls
- `types/` - Feature-specific type definitions
- `utils/` - Feature-specific utilities
- `index.ts` - Clean exports for the feature

### 3. **Clean Imports**

- All features export through `index.ts` files
- Consistent import paths using feature names
- No deep relative imports (`../../../`)
- Clear separation between internal and external dependencies

### 4. **Scalability**

- Easy to add new features without affecting existing code
- Clear boundaries between different layers
- Modular architecture supports team collaboration
- Consistent patterns across all features

## 🔧 Key Benefits

### **Maintainability**

- Related code is grouped together
- Clear file organization makes it easy to find code
- Consistent patterns reduce cognitive load
- Easy to refactor individual features

### **Scalability**

- New features can be added without touching existing code
- Clear boundaries prevent feature coupling
- Modular architecture supports team development
- Easy to extract features into separate packages

### **Developer Experience**

- Clean import statements
- Consistent file naming and organization
- Clear separation of concerns
- Easy to onboard new developers

### **Code Quality**

- Reduced code duplication
- Consistent patterns across features
- Clear type definitions
- Proper separation of business logic

## 📋 Import Patterns

### **App-Level Imports**

```typescript
import { AppNavigator } from "./src/app";
import { colors, spacing } from "./src/app/constants";
```

### **Core Imports**

```typescript
import { useAuthStore } from "./src/core/services";
import { User, Listing } from "./src/core/types";
```

### **Shared Imports**

```typescript
import { Button, Card, Input } from "./src/shared/components/ui";
import { formatDate } from "./src/shared/utils";
```

### **Feature Imports**

```typescript
import { LoginScreen, RegisterScreen } from "./src/features/auth";
import { PropertyCard } from "./src/features/apartments/components";
```

## 🚀 Getting Started

1. **Navigation**: All navigation components are in `src/app/components/`
2. **State Management**: All stores are in `src/core/services/`
3. **UI Components**: All reusable components are in `src/shared/components/ui/`
4. **Features**: Each feature has its own directory with screens, components, etc.

## 📝 Best Practices

1. **Always use index.ts files** for clean exports
2. **Keep feature boundaries clear** - don't import across features directly
3. **Use shared components** for common UI elements
4. **Place business logic** in the core layer
5. **Keep screens focused** on presentation logic only
6. **Use consistent naming** conventions across all files

This architecture provides a solid foundation for a professional, scalable React Native application that can grow with your team and requirements.
