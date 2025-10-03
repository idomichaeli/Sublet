import { PropertyCategory, PropertyType } from './PropertyObject';

// Property Category Object - Step 0
export interface PropertyCategoryObject {
  propertyCategory?: PropertyCategory;
  propertyType?: PropertyType;
}

// Property category options
export const PROPERTY_CATEGORIES = [
  {
    id: "house" as PropertyCategory,
    label: "House",
    icon: "house",
  },
  {
    id: "apartment" as PropertyCategory,
    label: "Apartment",
    icon: "apartment",
  },
];

// Property type options
export const PROPERTY_TYPES = [
  {
    id: "entire_place" as PropertyType,
    label: "Entire Place",
    icon: "🏠",
    description: "Renters get the whole place to themselves",
  },
  {
    id: "room" as PropertyType,
    label: "Room",
    icon: "🚪",
    description: "Renters get a private room, shared common areas",
  },
  {
    id: "shared_room" as PropertyType,
    label: "Shared Room",
    icon: "👥",
    description: "Renters share a room with others",
  },
];

// Default property category object
export const createDefaultPropertyCategoryObject = (): PropertyCategoryObject => ({
  propertyCategory: undefined,
  propertyType: undefined,
});

// Property category validation
export const validatePropertyCategory = (category: PropertyCategoryObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!category.propertyCategory) {
    errors.push("Property category is required");
  }

  if (!category.propertyType) {
    errors.push("Property type is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property category utilities
export const getPropertyCategoryLabel = (category: PropertyCategory): string => {
  const found = PROPERTY_CATEGORIES.find(c => c.id === category);
  return found?.label || "Unknown";
};

export const getPropertyTypeLabel = (type: PropertyType): string => {
  const found = PROPERTY_TYPES.find(t => t.id === type);
  return found?.label || "Unknown";
};

export const getPropertyTypeDescription = (type: PropertyType): string => {
  const found = PROPERTY_TYPES.find(t => t.id === type);
  return found?.description || "";
};

export const getPropertyCategoryDisplay = (category: PropertyCategoryObject): string => {
  if (!category.propertyCategory || !category.propertyType) {
    return "Not selected";
  }
  
  const categoryLabel = getPropertyCategoryLabel(category.propertyCategory);
  const typeLabel = getPropertyTypeLabel(category.propertyType);
  
  return `${categoryLabel} - ${typeLabel}`;
};

// Property category step props
export interface PropertyCategoryStepProps {
  data: PropertyCategoryObject;
  onUpdate: (updates: Partial<PropertyCategoryObject>) => void;
}
