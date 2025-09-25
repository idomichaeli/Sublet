# UI/UX Style Guide - Professional Renting App

## Overview

This style guide defines the design system for our professional renting apartments platform. The design prioritizes **trustworthiness, professionalism, and approachability** while maintaining modern mobile UI/UX best practices.

## Design Philosophy

- **Trustworthy & Professional**: Clean, consistent design that builds user confidence
- **Approachable**: Friendly, intuitive interface that doesn't intimidate users
- **Modern Mobile-First**: Optimized for mobile devices with touch-friendly interactions
- **Accessible**: Meets WCAG AA standards for accessibility

---

## 1. Color Palette

### Primary Colors - Nature Green

```typescript
primary: {
  50: '#F0F9F0',   // Lightest
  100: '#DCF2DC',
  200: '#B8E5B8',
  300: '#94D894',
  400: '#70CB70',
  500: '#4CAF50',  // Main primary (buttons, highlights) - Nature Green
  600: '#3D8B40',
  700: '#2E7D32',
  800: '#1F5F23',
  900: '#0F3F14',  // Darkest
}
```

### Secondary Colors - Nature Yellow

```typescript
secondary: {
  50: '#FFFEF0',   // Lightest
  100: '#FFFCDB',
  200: '#FFF9B7',
  300: '#FFF693',
  400: '#FFF36F',
  500: '#FFEB3B',  // Main secondary (accent states) - Nature Yellow
  600: '#FBC02D',
  700: '#F9A825',
  800: '#F57F17',
  900: '#F57C00',  // Darkest
}
```

### Neutral Colors

```typescript
neutral: {
  0: '#FFFFFF',    // Pure white
  50: '#FAFAFA',   // Background light
  100: '#F5F5F5',  // Background
  200: '#EEEEEE',  // Borders
  300: '#E0E0E0',  // Input borders
  400: '#BDBDBD',  // Disabled
  500: '#9E9E9E',  // Placeholder
  600: '#757575',  // Secondary text
  700: '#616161',  // Secondary text dark
  800: '#424242',  // Primary text dark
  900: '#212121',  // Primary text
  950: '#121212',  // Dark mode background
}
```

### Status Colors

```typescript
success: "#4CAF50"; // Approved bookings, available (Nature Green)
warning: "#FFEB3B"; // Pending bookings (Nature Yellow)
error: "#F44336"; // Rejected bookings, errors
```

---

## 2. Typography

### Font Family

- **Primary**: Inter (sans-serif, highly legible)
- **Fallback**: System fonts (San Francisco on iOS, Roboto on Android)

### Text Scale

```typescript
fontSize: {
  xs: 12,    // Captions, metadata
  sm: 14,    // Small text, labels
  base: 16,  // Body text, descriptions
  lg: 18,    // Large body text
  xl: 20,    // Section headers
  '2xl': 22, // Page subtitles
  '3xl': 24, // Page titles
  '4xl': 28, // Main headings
  '5xl': 32, // Hero text
}
```

### Text Styles

- **H1 (28px, bold)**: Page titles, main headings
- **H2 (22px, semi-bold)**: Section titles, card headers
- **H3 (20px, semi-bold)**: Subsection titles
- **Body (16px, regular)**: Descriptions, chat messages, form labels
- **Caption (14px, medium)**: Metadata, dates, status indicators
- **Button (16px, semi-bold)**: Button text

### Line Height

- **Tight**: 1.2x (headings)
- **Normal**: 1.4x (body text)
- **Relaxed**: 1.6x (long-form content)

---

## 3. Spacing System

### 8pt Grid System

```typescript
spacing: {
  xs: 4,   // 4px - Tight spacing
  sm: 8,   // 8px - Small spacing
  md: 16,  // 16px - Medium spacing (default)
  lg: 24,  // 24px - Large spacing
  xl: 32,  // 32px - Extra large spacing
  '2xl': 48, // 48px - Section spacing
  '3xl': 64, // 64px - Page spacing
}
```

### Usage Guidelines

- **Component padding**: 16px (md)
- **Card margins**: 24px (lg)
- **Section spacing**: 32px (xl)
- **Page margins**: 24px (lg)

---

## 4. Border Radius

```typescript
borderRadius: {
  none: 0,    // No radius
  sm: 4,      // Small elements
  md: 8,      // Buttons, inputs
  lg: 12,     // Cards, containers
  xl: 16,     // Large cards
  '2xl': 24,  // Hero elements
  full: 9999, // Pills, tags
}
```

---

## 5. Shadows & Elevation

```typescript
shadows: {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
}
```

---

## 6. Component Guidelines

### Buttons

#### Primary Button

- **Background**: Nature Green (#4CAF50)
- **Text**: White
- **Border**: Nature Green
- **Radius**: 12px
- **Padding**: 16px horizontal, 12px vertical
- **Min Height**: 44px (touch target)

#### Secondary Button

- **Background**: Transparent
- **Text**: Nature Green
- **Border**: Nature Green
- **Radius**: 12px
- **Padding**: 16px horizontal, 12px vertical

#### Tertiary Button

- **Background**: Transparent
- **Text**: Nature Green
- **Border**: None
- **Underline**: On hover/press

### Cards

#### Apartment Listing Card

- **Background**: White
- **Border**: Light gray (#EEEEEE)
- **Radius**: 12px
- **Shadow**: Medium
- **Padding**: 16px
- **Image**: 200px height, rounded corners

#### Dashboard Card

- **Background**: White
- **Border**: Light gray
- **Radius**: 12px
- **Shadow**: Small
- **Padding**: 16px

### Input Fields

#### Text Input

- **Background**: White
- **Border**: Light gray (#E0E0E0)
- **Border Focus**: Nature Green
- **Radius**: 12px
- **Padding**: 16px horizontal, 12px vertical
- **Min Height**: 44px

#### Search Bar

- **Background**: White
- **Border**: Light gray
- **Radius**: 12px
- **Icon**: Nature Green
- **Placeholder**: Medium gray

### Tags/Chips

#### Status Tags

- **Available**: Nature Green background, dark green text
- **Pending**: Nature Yellow background, dark yellow text
- **Rejected**: Red background, dark red text
- **Unavailable**: Gray background, dark gray text

---

## 7. Navigation Patterns

### Renter Navigation (Bottom Tabs)

- **Home**: Browse apartments
- **Favorites**: Saved listings
- **Bookings**: My bookings
- **Profile**: Account settings

### Owner Navigation (Stack)

- **Dashboard**: Overview, stats, quick actions
- **Properties**: Manage listings
- **Requests**: Booking requests
- **Payments**: Revenue, payouts
- **Messages**: Chat with renters

### Header Styling

- **Background**: White
- **Title**: 18px, semi-bold, dark gray
- **Back Button**: Nature Green
- **Border**: Light gray bottom border

---

## 8. UX Patterns

### Apartment Listing Cards

1. **Image**: High-quality photo at top
2. **Title**: Bold, 2-line max
3. **Price**: Prominent, nature green color
4. **Location**: With location icon
5. **Status**: Color-coded tag
6. **Action**: "Book Now" button

### Search & Filters

1. **Search Bar**: Prominent, with search icon
2. **Quick Filters**: Horizontal scroll, pill buttons
3. **Advanced Filters**: Modal with multiple options
4. **Results**: Clear count and sorting options

### Booking Flow

1. **Select Dates**: Calendar picker
2. **Review Details**: Summary card
3. **Payment**: Secure payment form
4. **Confirmation**: Success screen with details

### Empty States

- **Illustration**: Simple, friendly icon
- **Title**: Clear, helpful message
- **Description**: Guidance on next steps
- **Action**: Primary button to get started

---

## 9. Accessibility Guidelines

### Color Contrast

- **Text on white**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **Interactive elements**: Minimum 3:1 ratio

### Touch Targets

- **Minimum size**: 44px x 44px
- **Spacing**: 8px between targets
- **Visual feedback**: Clear pressed states

### Screen Reader Support

- **Labels**: All interactive elements labeled
- **Headings**: Proper heading hierarchy
- **Focus**: Logical tab order
- **Announcements**: Important state changes

### Motion & Animation

- **Duration**: 200-300ms for micro-interactions
- **Easing**: Smooth, natural curves
- **Reduced motion**: Respect user preferences
- **Purpose**: Meaningful, not decorative

---

## 10. Dark Mode Support

### Dark Theme Colors

```typescript
dark: {
  background: '#121212',      // Main background
  surface: '#1E1E1E',         // Card backgrounds
  surfaceVariant: '#2C2C2C',  // Elevated surfaces
  onBackground: '#FFFFFF',    // Text on background
  onSurface: '#FFFFFF',       // Text on surfaces
  onSurfaceVariant: '#B3B3B3', // Secondary text
}
```

### Implementation

- **System preference**: Follow device setting
- **Manual toggle**: Available in settings
- **Consistent**: All components support both themes
- **Testing**: Verify contrast in both modes

---

## 11. Responsive Design

### Breakpoints

```typescript
breakpoints: {
  sm: 640,   // Small tablets
  md: 768,   // Tablets
  lg: 1024,  // Small laptops
  xl: 1280,  // Large screens
}
```

### Mobile-First Approach

- **Base styles**: Mobile (320px+)
- **Progressive enhancement**: Larger screens
- **Touch-friendly**: All interactions optimized for touch
- **Performance**: Optimized for mobile networks

---

## 12. Implementation Notes

### Design Tokens

- **Centralized**: All values in `src/design/tokens.ts`
- **Type-safe**: TypeScript interfaces
- **Consistent**: Single source of truth
- **Maintainable**: Easy to update globally

### Component Library

- **Reusable**: Common components in `src/components/common/`
- **Consistent**: Follow design system
- **Accessible**: Built-in accessibility features
- **Customizable**: Props for variations

### Best Practices

- **Consistency**: Use design tokens everywhere
- **Accessibility**: Test with screen readers
- **Performance**: Optimize images and animations
- **Testing**: Test on multiple devices and screen sizes

---

## 13. Quality Assurance

### Design Review Checklist

- [ ] Colors match design tokens
- [ ] Typography follows scale
- [ ] Spacing uses 8pt grid
- [ ] Touch targets are 44px minimum
- [ ] Contrast meets WCAG AA
- [ ] Works in both light/dark modes
- [ ] Responsive on different screen sizes
- [ ] Animations are smooth and purposeful

### Testing Guidelines

- **Devices**: Test on iOS and Android
- **Screen sizes**: Phone, tablet, large screens
- **Accessibility**: VoiceOver, TalkBack
- **Performance**: Smooth 60fps animations
- **Network**: Works on slow connections

---

This style guide ensures consistency, accessibility, and professional quality across the entire renting platform. Regular updates and team alignment on these standards will maintain the high-quality user experience our users expect.
