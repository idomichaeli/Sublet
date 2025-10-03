// Property Amenities Object - Step 3
export interface PropertyAmenitiesObject {
  amenities: string[];
}

// Required amenities (essential amenities)
export const REQUIRED_AMENITIES = [
  { id: "wifi", label: "WiFi", icon: "📶" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "elevator", label: "Elevator", icon: "🛗" },
  { id: "furnished", label: "Furnished", icon: "🛋️" },
  { id: "pet_friendly", label: "Pet-friendly", icon: "🐕" },
  { id: "smoking_allowed", label: "Smoking Allowed", icon: "🚬" },
  { id: "accessible", label: "Accessible", icon: "♿" },
  { id: "none", label: "None of them", icon: "❌" },
];

// Additional amenities
export const ADDITIONAL_AMENITIES = [
  { id: "heating", label: "Heating", icon: "🔥" },
  { id: "parking", label: "Parking", icon: "🚗" },
  { id: "gym", label: "Gym", icon: "💪" },
  { id: "pool", label: "Pool", icon: "🏊" },
  { id: "laundry", label: "Laundry", icon: "🧺" },
  { id: "storage", label: "Storage", icon: "📦" },
  { id: "garden", label: "Garden", icon: "🌳" },
  { id: "rooftop", label: "Rooftop", icon: "🏢" },
];

// All amenities combined
export const ALL_AMENITIES = [...REQUIRED_AMENITIES, ...ADDITIONAL_AMENITIES];

// Default property amenities object
export const createDefaultPropertyAmenitiesObject = (): PropertyAmenitiesObject => ({
  amenities: [],
});

// Property amenities validation
export const validatePropertyAmenities = (amenities: PropertyAmenitiesObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  const requiredAmenityIds = REQUIRED_AMENITIES.map(a => a.id);
  const hasRequiredAmenity = amenities.amenities.some(amenityId => requiredAmenityIds.includes(amenityId));

  if (!hasRequiredAmenity) {
    errors.push("At least one essential amenity is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property amenities utilities
export const getAmenityLabel = (amenityId: string): string => {
  const found = ALL_AMENITIES.find(a => a.id === amenityId);
  return found?.label || amenityId;
};

export const getAmenityIcon = (amenityId: string): string => {
  const found = ALL_AMENITIES.find(a => a.id === amenityId);
  return found?.icon || "❓";
};

export const getAmenityDisplay = (amenityId: string): string => {
  const icon = getAmenityIcon(amenityId);
  const label = getAmenityLabel(amenityId);
  return `${icon} ${label}`;
};

export const getSelectedAmenities = (amenities: PropertyAmenitiesObject): string[] => {
  return amenities.amenities.map(id => getAmenityLabel(id));
};

export const getSelectedAmenitiesDisplay = (amenities: PropertyAmenitiesObject): string => {
  const selectedLabels = getSelectedAmenities(amenities);
  return selectedLabels.length > 0 ? selectedLabels.join(", ") : "None selected";
};

export const hasAmenity = (amenities: PropertyAmenitiesObject, amenityId: string): boolean => {
  return amenities.amenities.includes(amenityId);
};

export const addAmenity = (amenities: PropertyAmenitiesObject, amenityId: string): PropertyAmenitiesObject => {
  const requiredAmenityIds = REQUIRED_AMENITIES.map(a => a.id);
  const additionalAmenityIds = ADDITIONAL_AMENITIES.map(a => a.id);

  let newAmenities;

  if (amenityId === "none") {
    // If "None of them" is selected, clear only required amenities but keep additional ones
    if (amenities.amenities.includes("none")) {
      newAmenities = amenities.amenities.filter(id => additionalAmenityIds.includes(id));
    } else {
      newAmenities = [
        ...amenities.amenities.filter(id => additionalAmenityIds.includes(id)),
        "none",
      ];
    }
  } else if (requiredAmenityIds.includes(amenityId)) {
    // If a required amenity is selected, remove "none" and toggle the selected amenity
    newAmenities = amenities.amenities.includes(amenityId)
      ? amenities.amenities.filter(id => id !== amenityId)
      : [...amenities.amenities.filter(id => id !== "none"), amenityId];
  } else {
    // If an additional amenity is selected, just toggle it (don't affect "none")
    newAmenities = amenities.amenities.includes(amenityId)
      ? amenities.amenities.filter(id => id !== amenityId)
      : [...amenities.amenities, amenityId];
  }

  return {
    ...amenities,
    amenities: newAmenities
  };
};

export const removeAmenity = (amenities: PropertyAmenitiesObject, amenityId: string): PropertyAmenitiesObject => {
  return {
    ...amenities,
    amenities: amenities.amenities.filter(id => id !== amenityId)
  };
};

export const getRequiredAmenities = (amenities: PropertyAmenitiesObject): string[] => {
  const requiredAmenityIds = REQUIRED_AMENITIES.map(a => a.id);
  return amenities.amenities.filter(id => requiredAmenityIds.includes(id));
};

export const getAdditionalAmenities = (amenities: PropertyAmenitiesObject): string[] => {
  const additionalAmenityIds = ADDITIONAL_AMENITIES.map(a => a.id);
  return amenities.amenities.filter(id => additionalAmenityIds.includes(id));
};

export const hasRequiredAmenity = (amenities: PropertyAmenitiesObject): boolean => {
  const requiredAmenityIds = REQUIRED_AMENITIES.map(a => a.id);
  return amenities.amenities.some(amenityId => requiredAmenityIds.includes(amenityId));
};

export const isNoneSelected = (amenities: PropertyAmenitiesObject): boolean => {
  return amenities.amenities.includes("none");
};

// Property amenities step props
export interface PropertyAmenitiesStepProps {
  data: PropertyAmenitiesObject;
  onUpdate: (updates: Partial<PropertyAmenitiesObject>) => void;
}
