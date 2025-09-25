# Color Standardization - Uplet Project

## Overview

This document outlines the color standardization changes made to ensure consistent use of design tokens throughout the Uplet project. The project now uses a **Nature Green and Yellow** color scheme for a fresh, organic feel.

## Changes Made

### 1. Enhanced Design Tokens (`src/shared/constants/tokens.ts`)

#### Added Opacity System

```typescript
// Opacity variants for colors
export const colorOpacity = {
  "10": "1A", // 10% opacity
  "20": "33", // 20% opacity
  "30": "4D", // 30% opacity
  "40": "66", // 40% opacity
  "50": "80", // 50% opacity
  "60": "99", // 60% opacity
  "70": "B3", // 70% opacity
  "80": "CC", // 80% opacity
  "90": "E6", // 90% opacity
} as const;

// Helper function to create colors with opacity
export const withOpacity = (
  color: string,
  opacity: keyof typeof colorOpacity
): string => {
  return color + colorOpacity[opacity];
};
```

#### Updated Liquid Glass Tokens

```typescript
export const liquidGlass = {
  background: withOpacity(colors.neutral[0], "10"),
  backgroundDark: withOpacity(colors.neutral[900], "10"),
  border: withOpacity(colors.neutral[0], "20"),
  borderDark: withOpacity(colors.neutral[0], "10"),
  shadow: {
    color: withOpacity(colors.neutral[900], "10"),
    // ... other properties
  },
} as const;
```

### 2. Navigation Components

#### BottomTabNavigator.tsx

**Before:**

```typescript
tabBarActiveTintColor: "#228B22",
tabBarInactiveTintColor: "#228B22",
backgroundColor: "#F5F5DC",
borderTopColor: "#E6E6FA",
```

**After:**

```typescript
tabBarActiveTintColor: colors.primary[500], // Nature Green (#4CAF50)
tabBarInactiveTintColor: colors.neutral[600],
backgroundColor: colors.neutral[50],
borderTopColor: colors.neutral[200],
```

#### OwnerBottomTabNavigator.tsx

Applied the same color standardization as BottomTabNavigator.

### 3. UI Components

#### Toggle.tsx

**Before:**

```typescript
shadowColor: "#000",
```

**After:**

```typescript
shadowColor: colors.neutral[900],
```

### 4. Feature Components

#### AreaStoryCard.tsx

**Before:**

```typescript
backgroundColor: "rgba(0,0,0,0.4)",
textShadowColor: "rgba(0,0,0,0.5)",
```

**After:**

```typescript
backgroundColor: withOpacity(colors.neutral[900], '40'),
textShadowColor: withOpacity(colors.neutral[900], '50'),
```

#### SwipeCard.tsx

**Before:**

```typescript
colors={["transparent", "rgba(0,0,0,0.7)"]}
backgroundColor: "rgba(255, 255, 255, 0.9)",
backgroundColor: "rgba(255, 255, 255, 0.2)",
```

**After:**

```typescript
colors={["transparent", withOpacity(colors.neutral[900], '70')]}
backgroundColor: withOpacity(colors.neutral[0], '90'),
backgroundColor: withOpacity(colors.neutral[0], '20'),
```

#### FavoritesScreen.tsx

**Before:**

```typescript
backgroundColor: "rgba(255, 255, 255, 0.9)",
backgroundColor: "rgba(0, 0, 0, 0.7)",
```

**After:**

```typescript
backgroundColor: withOpacity(colors.neutral[0], '90'),
backgroundColor: withOpacity(colors.neutral[900], '70'),
```

#### HeroCarousel.tsx

**Before:**

```typescript
backgroundColor: "rgba(0, 0, 0, 0.4)",
```

**After:**

```typescript
backgroundColor: withOpacity(colors.neutral[900], '40'),
```

## Benefits

### 1. **Consistency**

- All colors now use the centralized design token system
- Consistent opacity values across the application
- No more scattered hardcoded color values

### 2. **Maintainability**

- Easy to update colors globally by changing design tokens
- Clear opacity system with predefined values
- Type-safe color usage with TypeScript

### 3. **Design System Compliance**

- All colors follow the established design system
- Proper use of primary, secondary, and neutral color palettes
- Consistent opacity handling

### 4. **Developer Experience**

- `withOpacity()` helper function for easy color manipulation
- Clear naming conventions for opacity levels
- IntelliSense support for color tokens

## Usage Guidelines

### Using Colors with Opacity

```typescript
import { colors, withOpacity } from '../../../shared/constants/tokens';

// Good - using design tokens
backgroundColor: withOpacity(colors.neutral[900], '40'),

// Bad - hardcoded values
backgroundColor: "rgba(0, 0, 0, 0.4)",
```

### Available Opacity Levels

- `'10'` - 10% opacity (subtle overlays)
- `'20'` - 20% opacity (light backgrounds)
- `'30'` - 30% opacity
- `'40'` - 40% opacity (moderate overlays)
- `'50'` - 50% opacity (balanced overlays)
- `'60'` - 60% opacity
- `'70'` - 70% opacity (strong overlays)
- `'80'` - 80% opacity
- `'90'` - 90% opacity (near solid)

## Files Updated

### Design Tokens

- `src/shared/constants/tokens.ts` - Added opacity system and helper functions

### Navigation

- `src/shared/components/layout/BottomTabNavigator.tsx`
- `src/shared/components/layout/OwnerBottomTabNavigator.tsx`

### UI Components

- `src/shared/components/ui/Toggle.tsx`

### Feature Components

- `src/features/favorites/components/AreaStoryCard.tsx`
- `src/features/swipe/components/SwipeCard.tsx`
- `src/features/swipe/FavoritesScreen.tsx`
- `src/features/swipe/components/HeroCarousel.tsx`

## Nature Color Scheme

### Primary Colors - Nature Green

- **Main Primary**: #4CAF50 (Nature Green)
- **Light Variants**: #F0F9F0 to #70CB70
- **Dark Variants**: #3D8B40 to #0F3F14

### Secondary Colors - Nature Yellow

- **Main Secondary**: #FFEB3B (Nature Yellow)
- **Light Variants**: #FFFEF0 to #FFF36F
- **Dark Variants**: #FBC02D to #F57C00

### Status Colors

- **Success/Approved**: Nature Green (#4CAF50)
- **Warning/Pending**: Nature Yellow (#FFEB3B)
- **Error/Rejected**: Red (#F44336)

## Verification

✅ **No hardcoded hex colors** found in component files  
✅ **No hardcoded rgba values** found in component files  
✅ **All colors use design tokens** from the centralized system  
✅ **Consistent opacity handling** using the `withOpacity` helper  
✅ **Type-safe color usage** with TypeScript support  
✅ **Nature Green and Yellow theme** applied throughout the project

The project now has a fully standardized **Nature Green and Yellow** color system that ensures consistency, maintainability, and a fresh, organic aesthetic throughout the application.
