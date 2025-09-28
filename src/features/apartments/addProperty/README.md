# Add Property Flow

This folder contains all the components and logic for the property creation flow for owners using the new modular property object system.

## Structure

```
addProperty/
├── PropertyCreationScreen.tsx     # Main screen with step navigation
├── components/
│   ├── PropertyCreationProgressIndicator.tsx # Step progress indicator
│   └── PropertyTypeSelectionBottomSheet.tsx # Bottom sheet for property type selection
├── steps/
│   ├── PropertyTypeCategoryStep.tsx  # Step 0: Property category selection (House/Apartment)
│   ├── PropertyLocationStep.tsx      # Step 1: Location selection with real-time validation
│   ├── PropertyBasicDetailsStep.tsx  # Step 2: Property details
│   ├── PropertyAmenitiesStep.tsx     # Step 3: Amenities selection
│   ├── PropertyPhotosStep.tsx        # Step 4: Photo upload
│   ├── PropertyAvailabilityStep.tsx  # Step 5: Availability & flexibility settings
│   ├── PropertyPricingStep.tsx       # Step 6: Pricing
│   └── PropertyReviewStep.tsx        # Step 7: Review & publish
├── types/
│   └── PropertyCreationData.ts      # Legacy TypeScript interfaces (deprecated)
├── PropertyManagerExample.tsx       # Example component showing PropertyManager usage
├── index.ts                         # Main exports
└── README.md                        # This file
```

## Features

### 8-Step Process with Real-time Validation

1. **Property Category** - Select property category (House, Apartment) → Opens bottom sheet for property type selection
2. **Location** - Property location and area selection with real-time text input validation
3. **Basic Details** - Bedrooms, bathrooms, size, renovation status with custom input support
4. **Amenities** - Available amenities and features with smart toggle logic
5. **Photos** - Property photos with upload tips and validation
6. **Availability** - Set availability dates and flexibility options
7. **Pricing** - Monthly rent pricing with derived calculations
8. **Review** - Final review before publishing with complete property summary

### Key Components

- **PropertyCreationProgressIndicator**: Visual step progress with dots and labels
- **Step Components**: Individual step forms with real-time validation
- **PropertyManager**: Centralized property state management
- **OwnerPropertyListManager**: Owner-specific property storage
- **Navigation**: Back/Next buttons with real-time validation states

### New Property Object System

The flow now uses modular property objects located in `src/core/types/propertyObjects/`:

- **PropertyObject**: Main property interface combining all step data
- **PropertyCategoryObject**: Step 0 data (category, type)
- **PropertyLocationObject**: Step 1 data (address, shelter info)
- **PropertyBasicDetailsObject**: Step 2 data (rooms, size, renovation)
- **PropertyAmenitiesObject**: Step 3 data (amenities list)
- **PropertyPhotosObject**: Step 4 data (photo URLs)
- **PropertyAvailabilityObject**: Step 5 data (dates, flexibility)
- **PropertyPricingObject**: Step 6 data (price, frequency)
- **PropertyReviewObject**: Step 7 data (aggregated review data)

### Data Flow

- **PropertyManager**: Centralized property state management with `usePropertyManager()` hook
- **Real-time Updates**: All steps update property object immediately on field changes
- **Validation**: Next button enables/disables based on real-time validation
- **Persistence**: Draft saving and final publishing to owner's property list
- **Owner Integration**: Properties automatically added to owner's property list

### Usage

```tsx
import PropertyCreationScreen from "../features/apartments/addProperty/PropertyCreationScreen";

// In navigation stack
<Stack.Screen
  name="AddProperty"
  component={PropertyCreationScreen}
  options={{ headerShown: false }}
/>;
```

### PropertyManager Integration

```tsx
import { usePropertyManager } from "../../core/services/propertyManager";

// In component
const propertyManager = usePropertyManager("owner123");
const property = propertyManager.getCurrentProperty();

// Initialize new property
useEffect(() => {
  propertyManager.initializeNewProperty();
}, []);

// Update property
const updateData = (updates) => {
  propertyManager.updateProperty(updates);
};

// Save as draft
const saveDraft = () => {
  const result = propertyManager.saveDraft();
  if (result.success) {
    // Handle success
  }
};

// Publish property
const publishProperty = () => {
  const result = propertyManager.publishProperty();
  if (result.success) {
    // Handle success
  }
};
```

### Owner Property List Integration

```tsx
import { useOwnerPropertyList } from "../../core/services/ownerPropertyListManager";

// In component
const ownerPropertyList = useOwnerPropertyList("owner123");

// Get all properties
const allProperties = ownerPropertyList.getAllProperties();

// Get published properties
const publishedProperties = ownerPropertyList.getPublishedProperties();

// Get property statistics
const stats = ownerPropertyList.getPropertyStats();
```

### Customization

- Add new steps by creating components in `/steps/`
- Update the `STEPS` array in `PropertyCreationScreen.tsx`
- Extend property objects in `src/core/types/propertyObjects/`
- Modify step order by updating the switch statement
- Add new validation rules in `validateCurrentStep()`

### Validation

- **Real-time Validation**: Next button enables/disables based on current step validation
- **Step-specific Rules**: Each step has its own validation requirements
- **Property-level Validation**: Complete property validation before publishing
- **Visual Feedback**: Button states and error messages provide user feedback

### Key Features

- ✅ **Real-time Text Input**: Location step updates property object on each keystroke
- ✅ **Smart Validation**: Next button state updates immediately when requirements are met
- ✅ **Owner Integration**: Properties automatically saved to owner's property list
- ✅ **Draft Support**: Save progress at any time
- ✅ **Type Safety**: Full TypeScript support with modular property objects
- ✅ **Persistence**: Data persists across app sessions
- ✅ **Status Tracking**: Draft, published, archived property states
