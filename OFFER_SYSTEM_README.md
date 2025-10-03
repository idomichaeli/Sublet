# Offer System Implementation

## Overview

This implementation provides a comprehensive offer system for the Uplet rental platform, allowing renters to submit offers to property owners with custom prices, dates, and notes.

## Files Created/Modified

### 1. Core Type Definition (`src/core/types/offerObject.ts`)

- **OfferObject**: Main interface containing all offer data including:

  - Property owner's original listing details (price, dates)
  - Renter's offer details (price, dates, note)
  - User information (renter and owner details)
  - Calculated fields (price difference, weekly/daily rates)
  - Status management and timestamps

- **CreateOfferData**: Input interface for creating new offers
- **OfferFilters**: Filter options for owner inbox
- **OfferStats**: Statistics for owner dashboard
- **CounterOffer**: Structure for counter-offer negotiations

### 2. Offer Service (`src/core/services/offerService.ts`)

Core service for managing offers with features:

- AsyncStorage persistence for offline functionality
- Offer creation with validation
- Owner inbox filtering (by property, status, price, dates)
- Offer status management (accept/reject/expire)
- Automatic expiry handling (48-hour default)
- Offer statistics calculation

### 3. Renter Offer Service (`src/core/services/renterOfferService.ts`)

Front-end service for renters to submit offers:

- Input validation and sanitization
- Offer submission with user information
- Price recommendation calculations
- Offer formatting and summarization

### 4. Owner Inbox Integration (`src/features/apartments/screens/PropertyInterestedRentersScreen.tsx`)

Updated the existing owner inbox to:

- Display real offers instead of mock data
- Filter offers by status (all/pending/accepted/rejected)
- Accept/reject offers with persistence
- Real-time offer updates

### 5. Demo Data Service (`src/core/services/demoOfferData.ts`)

Utility functions for testing:

- `createDemoOffers()`: Creates sample offers with different scenarios
- `clearDemoOffers()`: Resets all test data
- `getOwnerOfferStats()`: Displays offer statistics

### 6. Offer Submission Form (`src/shared/components/OfferSubmissionForm.tsx`)

React Native component for renters to:

- Submit offers with price, dates, and notes
- View price recommendations
- See offer summaries with calculations
- Validate inputs before submission

## How It Works

### 1. Renter Submits Offer

```typescript
// Using the OfferSubmissionForm component
const propertyData = {
  id: "property_1",
  title: "Beautiful Apartment",
  image: "image_url",
  ownerId: "owner_1",
  ownerPrice: 4500, // Owner's asking price
  ownerStartDate: "2024-02-01",
  ownerEndDate: "2024-11-30",
};

const renterInput = {
  offerPrice: 4800, // Renter's offer (+$300)
  startDate: "2024-02-15",
  endDate: "2024-11-30",
  note: "I can move in immediately and provide extra deposits!",
};

await renterOfferService.submitOffer(
  propertyData,
  renterInput,
  userInfo,
  ownerInfo
);
```

### 2. Offer Object Creation

The system automatically creates a comprehensive OfferObject with:

- Price difference calculation (+$300 in this example)
- Weekly/daily rate conversions
- Message preview (first 50 characters)
- Expiry date (48 hours from creation)
- Rental duration calculation

### 3. Owner Views in Inbox

Owners see offers in their inbox with:

- Renter profile and verification status
- Price comparison (higher/same/lower than asking)
- Date flexibility vs. original listing
- Offer notes and message previews
- Action buttons (Accept/Counter Offer/Reject)

### 4. Offer Management

Owners can:

- Accept offers (creates chat/booking connection)
- Reject offers (with possible counter-offer)
- Filter by status or property
- View offer statistics

## Key Features

### ✅ Property Owner Price & Dates

- Captures owner's original asking price
- Stores owner's preferred start/end dates
- Shows original vs. offered comparisons

### ✅ Renter Input Collection

- Custom offer price input
- Flexible start/end date selection
- Optional note message (500 char limit)
- Validation for minimum rental period (30 days)

### ✅ Owner Inbox Integration

- Real-time offer display
- Status filtering (all/pending/accepted/rejected)
- Swipe gestures for quick actions
- Offer statistics dashboard

### ✅ Data Persistence

- AsyncStorage for offline functionality
- Automatic offer expiry (48 hours)
- Offer history and analytics

### ✅ User Experience

- Price recommendation buttons
- Offer summary calculations
- Input validation and error handling
- Responsive UI with loading states

## Usage Examples

### Create Demo Offers

```typescript
import { createDemoOffers } from "./src/core/services/demoOfferData";

// Creates 4 sample offers with different scenarios:
// - Sarah: $4800/month (+$300 above asking)
// - Michael: $3300/month (-$300 below asking)
// - Emma: $4500/month (exactly at asking)
// - David: $4700/month (+$200 above asking)

await createDemoOffers();
```

### Submit Real Offer

```typescript
import { OfferSubmissionForm } from "./src/shared/components/OfferSubmissionForm";

<OfferSubmissionForm
  propertyData={propertyObject}
  userInfo={currentUser}
  ownerInfo={propertyOwner}
  onOfferSubmitted={(success) => console.log("Offer submitted:", success)}
/>;
```

### View Owner Stats

```typescript
import { getOwnerOfferStats } from "./src/core/services/demoOfferData";

const stats = await getOwnerOfferStats("current-owner");
console.log(`Total: ${stats.totalOffers}, Pending: ${stats.pendingOffers}`);
```

## Testing the System

1. **Create demo data**: Call `createDemoOffers()` in your app
2. **Navigate to owner inbox**: Check "Offers" tab in owner navigation
3. **Filter offers**: Use status filter buttons
4. **Accept/reject**: Try the action buttons on offer cards
5. **View stats**: Check the offer statistics

The system is now fully integrated with the existing owner inbox infrastructure and ready for production use!
