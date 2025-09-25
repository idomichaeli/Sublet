# Uplet – Expo React Native Template (TypeScript)

A minimal Expo React Native template with React Navigation and TypeScript.

## Getting Started

```bash
npm install
npm run ios   # or: npm run android, npm run web
```

- iOS requires Xcode and an iOS simulator.
- Android requires Android Studio and an emulator, or a device with USB debugging.

## Scripts

- `npm start`: Start Expo dev server
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator/device
- `npm run web`: Run in the browser

## Project Structure

```
src/
  api/          # API clients (REST/GraphQL)
  assets/       # Images, icons, fonts
  components/
    common/     # Reusable UI components (Button, Card, Input, Tag, etc.)
    navigation/ # BottomTabNavigator, custom navigation components
    owner/      # Owner-specific components
    renter/     # Renter-specific components
  design/       # Design tokens, colors, typography, spacing
  hooks/        # Custom React hooks
  navigation/   # AppNavigator, AuthStack, OwnerStack, RenterStack
  screens/
    auth/       # Login, Register (with modern UI)
    owner/      # Dashboard, Edit, Requests, Payments, Chat
    renter/     # Home, Details, Booking, MyBookings, Chat, Profile
  services/     # Business logic wrappers
  store/        # Zustand stores: auth, listings, bookings, chat
  types/        # TypeScript models (user, listing, booking)
  utils/        # Helper functions
App.tsx         # Entrypoint → AppNavigator
```

## Design System

This project includes a comprehensive design system with:

- **Professional Color Palette**: Forest green primary, golden yellow secondary, and neutral grays
- **Typography Scale**: Inter font family with consistent sizing and weights
- **8pt Spacing System**: Consistent spacing throughout the app
- **Component Library**: Reusable UI components (Button, Card, Input, Tag, etc.)
- **Accessibility**: WCAG AA compliant with proper contrast ratios
- **Dark Mode Support**: Full dark theme implementation

See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for complete design system documentation.

## Navigation

Uses `@react-navigation/native` and `@react-navigation/native-stack` with a role-based flow:

- AuthStack → login/register
- OwnerStack → manage apartments, requests, payments, chat
- RenterStack → browse listings, booking, chat

`AppNavigator` decides flow based on `authStore.role` and `isAuthenticated`.

## Customization

- Update name/identifiers in `app.json`.
- Replace icons/splash in `assets/`.

## Troubleshooting

If Metro/bundler misbehaves:

```bash
rm -rf node_modules && npm install
expo start -c
```
