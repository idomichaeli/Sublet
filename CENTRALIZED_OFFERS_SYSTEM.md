# Centralized Offers System

## Overview

A centralized offers management system that ensures seamless flow of rental offers from renters to property owners' inboxes. All offers go through a single manager that handles validation, persistence, and real-time updates.

## Architecture

### 🏗️ Core Components

1. **OffersManager** (`src/core/services/offersManager.ts`)

   - Central hub for all offer operations
   - Handles offer creation, validation, and persistence
   - Provides real-time subscriptions for UI updates
   - Manages offer status transitions (pending → accepted/rejected)

2. **RenterOfferSubmission** (`src/core/services/renterOfferSubmission.ts`)

   - Simplified interface for renters to submit offers
   - Validates input and formats data
   - Routes all submissions through OffersManager

3. **Owner Inbox Integration** (`src/features/apartments/screens/PropertyInterestedRentersScreen.tsx`)
   - Real-time display of offers with subscriptions
   - Accept/reject functionality with automatic updates
   - Filtering by status and property

### 🔄 Data Flow

```
Renter Submission → OffersManager → AsyncStorage → Owner Inbox (Real-time)
     ↓                   ↓              ↓              ↓
RenterOfferSubmission.submitOffer() → Creates OfferObject → Persists → Notifies Subscribers → Updates UI
```

## Key Features

### ✅ Centralized Management

- **Single Source of Truth**: All offers managed through OffersManager
- **Real-time Updates**: Owner inbox automatically updates when new offers arrive
- **Status Management**: Offers can be accepted, rejected, or left pending
- **Automatic Expiry**: Offers expire after 48 hours if not responded to

### ✅ Offer Validation

- Price validation (must be > 0)
- Date validation (end date after start date, minimum 30-day rental)
- Note length validation (max 500 characters)
- Minimum rental period enforcement

### ✅ Real-time Synchronization

- Owner inbox subscribes to offer updates
- Immediate UI updates when offers are accepted/rejected
- Automatic cleanup of expired offers
- Persistent storage with AsyncStorage

### ✅ Property Mapping

- Each offer is linked to the specific property (`propertyId`)
- Owner can filter offers by property
- Property details included in offer display

## Usage

### 📝 Renter Side - Submit Offer

```typescript
import renterOfferSubmission from "./src/core/services/renterOfferSubmission";

const result = await renterOfferSubmission.submitOffer(
  // Property data from listing
  {
    id: "property_123",
    title: "Beautiful Apartment",
    image: "image_url",
    ownerId: "owner_456",
    ownerPrice: 4000,
    ownerStartDate: "2024-02-01",
    ownerEndDate: "2024-11-30",
  },
  // Renter input
  {
    offerPrice: 4200, // Above asking price
    startDate: "2024-02-15",
    endDate: "2024-11-30",
    note: "I would love to schedule a viewing...",
  },
  // Current user info
  {
    id: "renter_789",
    name: "John Doe",
    age: 28,
    occupation: "Software Engineer",
    location: "Tel Aviv",
    isVerified: true,
  },
  // Owner info
  {
    name: "Property Owner",
  }
);

if (result.success) {
  console.log("✅ Offer submitted and sent to owner inbox!");
} else {
  console.log("❌ Submission failed:", result.error);
}
```

### 🏠 Owner Side - View Offers

The owner inbox automatically displays all incoming offers with:

- Renter profile information
- Price comparison (higher/lower than asking)
- Local date ranges
- Offer notes and previews
- Accept/reject action buttons

### 📊 Get Offer Statistics

```typescript
import offersManager from "./src/core/services/offersManager";

const stats = await offersManager.getOwnerOfferStats("owner_id");
console.log(`Total offers: ${stats.total}`);
console.log(`Pending: ${stats.pending}`);
console.log(`Accepted: ${stats.accepted}`);
console.log(`Average offer price: $${stats.averageOfferPrice}`);
```

## Testing

### 🧪 Complete Flow Test

```typescript
import { testCompleteOfferFlow } from "./src/core/services/testOfferFlow";

// Run comprehensive test
const result = await testCompleteOfferFlow();
console.log(`Test ${result.success ? "PASSED" : "FAILED"}`);
```

### 🚀 Quick Submission Test

```typescript
import { testOfferSubmission } from "./src/core/services/testOfferFlow";

// Test just the submission flow
const result = await testOfferSubmission();
```

### 🧹 Clear Test Data

```typescript
import { clearTestOffers } from "./src/core/services/testOfferFlow";

// Remove all test offers
await clearTestOffers();
```

## Integration

### Owner Navigation

The system integrates with the existing owner tab navigation:

```typescript
// In OwnerMainTabNavigator.tsx
<Tab.Screen
  name="Offers"
  component={PropertyInterestedRentersScreen} // Updated to use OffersManager
  options={{ headerShown: false }}
/>
```

### Real-time Updates

The owner inbox automatically updates when:

- New offers are submitted by renters
- Offer status is changed (accept/reject)
- Offers expire
- Offers are deleted

### Subscription Management

```typescript
// Subscribe to real-time updates
const unsubscribe = offersManager.subscribe("owner_current-owner", (offers) => {
  // Update UI with latest offers
  setOffers(offers);
});

// Clean up subscription
unsubscribe();
```

## Files Structure

```
src/core/services/
├── offersManager.ts           # Central offers management
├── renterOfferSubmission.ts   # Simplified renter interface
├── testOfferFlow.ts          # Testing utilities
└── demoOfferData.ts          # Demo data creation

src/core/types/
└── offerObject.ts            # Offer type definitions

src/features/apartments/screens/
└── PropertyInterestedRentersScreen.tsx  # Updated owner inbox

src/shared/components/
└── OfferSubmissionForm.tsx   # Updated form component
```

## Performance Features

### 🚀 AsyncStorage Persistence

- Offline-first design with local storage
- Automatic synchronization on app launch
- Efficient storage with JSON serialization

### 🧹 Automatic Cleanup

- Expired offers automatically marked as expired
- Periodic cleanup runs every hour
- Redis subscription management prevents memory leaks

### ⚡ Real-time Updates

- Event-driven architecture with subscriptions
- Minimal overhead with targeted notifications
- UI updates only when necessary

## Error Handling

- Input validation with clear error messages
- Graceful fallbacks for storage issues
- Comprehensive logging for debugging
- Type-safe operations throughout

## Security Considerations

- Input sanitization for all user data
- Length limits on text fields
- Date validation prevents invalid ranges
- Owner ID validation prevents unauthorized access

---

**🎉 The centralized offers system ensures reliable communication between renters and property owners with real-time updates and comprehensive data management!**
