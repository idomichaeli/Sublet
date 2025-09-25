# Uplet - Project Structure

## Overview

This document outlines the new, organized project structure following React Native best practices with feature-based organization.

## Directory Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── apartments/             # Apartment management (Owner)
│   │   ├── components/         # Owner-specific components
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── ProfileActionItem.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   └── RenterCard.tsx
│   │   ├── AddApartmentScreen.tsx
│   │   ├── EditApartmentScreen.tsx
│   │   ├── OwnerDashboardScreen.tsx
│   │   ├── OwnerHomeScreen.tsx
│   │   ├── OwnerProfileScreen.tsx
│   │   ├── OwnerChatScreen.tsx
│   │   ├── InterestedRentersScreen.tsx
│   │   ├── RenterRequestsScreen.tsx
│   │   └── PaymentsScreen.tsx
│   ├── bookings/               # Booking management
│   │   └── components/         # Booking-specific components
│   ├── chat/                   # Chat functionality
│   │   └── components/         # Chat-specific components
│   ├── favorites/              # Favorites feature
│   │   ├── components/         # Favorites-specific components
│   │   │   ├── AreaStoryCard.tsx
│   │   │   └── AreaStoriesHeader.tsx
│   │   └── utils/              # Favorites utilities
│   │       └── areaUtils.ts
│   ├── profile/                # User profile
│   │   ├── components/         # Profile-specific components
│   │   └── ProfileScreen.tsx
│   └── swipe/                  # Swipe discovery feature
│       ├── components/         # Swipe-specific components
│       │   ├── FloatingActionButtons.tsx
│       │   ├── HomeHeader.tsx
│       │   ├── HeroCarousel.tsx
│       │   ├── ListingsSection.tsx
│       │   ├── ProgressIndicator.tsx
│       │   ├── QuickFilters.tsx
│       │   ├── SwipeCard.tsx
│       │   ├── SwipeEmptyState.tsx
│       │   └── SwipeStack.tsx
│       ├── data/               # Swipe-specific data
│       │   └── mockData.ts
│       ├── AreaDetailsScreen.tsx
│       ├── BookingScreen.tsx
│       ├── ChatScreen.tsx
│       ├── FavoritesScreen.tsx
│       ├── FavoritesTabScreen.tsx
│       ├── HomeScreen.tsx
│       ├── ListingDetailsScreen.tsx
│       ├── MyBookingsScreen.tsx
│       └── SwipeDiscoveryScreen.tsx
└── shared/                     # Shared resources
    ├── components/             # Reusable components
    │   ├── layout/             # Layout components
    │   │   ├── AppNavigator.tsx
    │   │   ├── BottomTabNavigator.tsx
    │   │   ├── OwnerBottomTabNavigator.tsx
    │   │   ├── OwnerStack.tsx
    │   │   └── RenterStack.tsx
    │   └── ui/                 # UI components
    │       ├── ApartmentCard.tsx
    │       ├── AreaStories.tsx
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── Chip.tsx
    │       ├── EmptyState.tsx
    │       ├── ImageUpload.tsx
    │       ├── Input.tsx
    │       ├── LocationPicker.tsx
    │       ├── MapPicker.tsx
    │       ├── SearchBar.tsx
    │       ├── Slider.tsx
    │       ├── Tag.tsx
    │       └── Toggle.tsx
    ├── constants/              # Constants and design tokens
    │   ├── locations.ts
    │   └── tokens.ts           # Design system tokens
    ├── data/                   # Mock data and fixtures
    │   └── mockApartments.ts
    ├── hooks/                  # Custom hooks
    │   ├── state/              # State management hooks
    │   │   ├── authStore.ts
    │   │   ├── bookingsStore.ts
    │   │   ├── chatStore.ts
    │   │   ├── favoritesStore.ts
    │   │   ├── FavoritesTabContext.tsx
    │   │   └── listingsStore.ts
    │   ├── api/                # API hooks
    │   └── ui/                 # UI hooks
    ├── services/               # API services and business logic
    │   ├── authApi.ts
    │   ├── authService.ts
    │   ├── bookingApi.ts
    │   ├── chatApi.ts
    │   ├── listingApi.ts
    │   └── paymentService.ts
    ├── types/                  # TypeScript type definitions
    │   ├── booking.ts
    │   ├── listing.ts
    │   └── user.ts
    └── utils/                  # Utility functions
        ├── validation/         # Validation utilities
        ├── formatting/         # Formatting utilities
        └── helpers/            # General helper functions
```

## Key Improvements

### 1. Feature-Based Organization

- **Before**: Files were organized by type (components, screens, etc.)
- **After**: Files are organized by feature (auth, apartments, swipe, etc.)
- **Benefits**: Better maintainability, easier to find related code, clearer boundaries

### 2. Component Splitting

- **HomeScreen.tsx**: Split from 506 lines into 4 smaller components:
  - `HomeHeader.tsx` - Header with view mode toggle
  - `HeroCarousel.tsx` - Hero banner carousel
  - `QuickFilters.tsx` - Filter buttons
  - `ListingsSection.tsx` - Apartment listings
- **AreaStories.tsx**: Split from 268 lines into 3 components:
  - `AreaStoryCard.tsx` - Individual area story card
  - `AreaStoriesHeader.tsx` - Header section
  - `areaUtils.ts` - Utility functions

### 3. Shared Resources

- **Components**: Moved to `shared/components/` with subcategories:
  - `ui/` - Reusable UI components
  - `layout/` - Layout and navigation components
- **Services**: Centralized in `shared/services/`
- **Hooks**: Organized by purpose in `shared/hooks/`
- **Constants**: Design tokens and app constants in `shared/constants/`

### 4. Import Path Updates

- All import statements have been updated to reflect new file locations
- Consistent relative path structure
- No broken imports or circular dependencies

## Benefits of New Structure

1. **Scalability**: Easy to add new features without cluttering existing directories
2. **Maintainability**: Related code is grouped together, making it easier to maintain
3. **Reusability**: Shared components are clearly separated and easily accessible
4. **Team Collaboration**: Clear boundaries make it easier for multiple developers to work on different features
5. **Code Splitting**: Smaller components are easier to understand, test, and debug
6. **Performance**: Better tree-shaking and code splitting opportunities

## Migration Summary

- ✅ **78 files** processed and updated
- ✅ **5 major components** split into smaller, focused components
- ✅ **All import paths** updated to new structure
- ✅ **No broken dependencies** or circular imports
- ✅ **Feature-based organization** implemented
- ✅ **Shared resources** properly categorized

The project now follows modern React Native best practices with a clean, scalable architecture that will support future growth and team collaboration.
