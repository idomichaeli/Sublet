# Add Property Flow

This folder contains all the components and logic for the property creation flow for owners.

## Structure

```
addProperty/
├── AddPropertyScreen.tsx          # Main screen with step navigation
├── components/
│   ├── ProgressIndicator.tsx      # Step progress indicator
│   └── PropertyTypeBottomSheet.tsx # Bottom sheet for property type selection
├── steps/
│   ├── PropertyCategoryStep.tsx  # Step 0: Property category selection (House/Apartment)
│   ├── LocationStep.tsx          # Step 1: Location selection
│   ├── BasicDetailsStep.tsx      # Step 2: Property details
│   ├── AmenitiesStep.tsx         # Step 3: Amenities selection
│   ├── PhotosStep.tsx            # Step 4: Photo upload
│   ├── AvailabilityStep.tsx      # Step 5: Availability & flexibility settings
│   ├── PricingStep.tsx           # Step 6: Pricing
│   └── ReviewStep.tsx            # Step 7: Review & publish
├── types/
│   └── PropertyData.ts            # TypeScript interfaces
├── index.ts                       # Main exports
└── README.md                      # This file
```

## Features

### 8-Step Process

1. **Property Category** - Select property category (House, Apartment) → Opens bottom sheet for property type selection
2. **Location** - Property location and area selection
3. **Basic Details** - Bedrooms, bathrooms, size, renovation status
4. **Amenities** - Available amenities and features
5. **Photos** - Property photos with upload tips
6. **Availability** - Set availability dates and flexibility options
7. **Pricing** - Monthly rent pricing
8. **Review** - Final review before publishing

### Key Components

- **ProgressIndicator**: Visual step progress with dots and labels
- **Step Components**: Individual step forms with validation
- **PropertyData Interface**: Type-safe data structure
- **Navigation**: Back/Next buttons with conditional logic

### Data Flow

- Each step updates the central `PropertyData` state
- Data persists across step navigation
- Draft saving functionality
- Final publish action

### Usage

```tsx
import { AddPropertyScreen } from "../features/apartments/addProperty";

// In navigation stack
<Stack.Screen
  name="AddProperty"
  component={AddPropertyScreen}
  options={{ headerShown: false }}
/>;
```

### Customization

- Add new steps by creating components in `/steps/`
- Update the `STEPS` array in `AddPropertyScreen.tsx`
- Extend `PropertyData` interface for new fields
- Modify step order by updating the switch statement

### Validation

Each step can implement its own validation logic. The main screen handles navigation between steps and final submission.
