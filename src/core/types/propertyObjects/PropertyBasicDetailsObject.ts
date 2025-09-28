// Property Basic Details Object - Step 2
export interface PropertyBasicDetailsObject {
  bedrooms: number;
  customBedrooms?: number; // For when bedrooms is 4+, this stores the actual count (supports decimals)
  isOneBedroomLivingRoom: boolean; // Whether one of the bedrooms is a living room
  bathrooms: number;
  customBathrooms?: number; // For when bathrooms is 3+, this stores the actual count (supports decimals)
  renovation: "new" | "renovated" | "needs_work";
  size: number;
  additionalRooms: string[]; // Array of selected additional rooms
}

// Renovation status options
export const RENOVATION_STATUSES = [
  {
    id: "new" as const,
    label: "✨ New",
    description: "Brand new property",
  },
  {
    id: "renovated" as const,
    label: "🛠️ Renovated",
    description: "Recently renovated property",
  },
  {
    id: "needs_work" as const,
    label: "🏚️ Needs work",
    description: "Property that needs renovation",
  },
];

// Specific room options (shown above Additional Rooms)
export const SPECIFIC_ROOMS = [
  "Kitchen",
  "Balcony", 
  "Garden/Yard",
  "Pantry"
];

// Additional room options
export const ADDITIONAL_ROOMS = [
  "Dining room",
  "Office room",
  "Garage",
  "Closet room",
  "Outdoor Kitchen",
];

// All available rooms
export const ALL_ROOMS = [...SPECIFIC_ROOMS, ...ADDITIONAL_ROOMS];

// Default property basic details object
export const createDefaultPropertyBasicDetailsObject = (): PropertyBasicDetailsObject => ({
  bedrooms: 1,
  customBedrooms: undefined,
  isOneBedroomLivingRoom: false,
  bathrooms: 1,
  customBathrooms: undefined,
  renovation: "new",
  size: 50,
  additionalRooms: [],
});

// Property basic details validation
export const validatePropertyBasicDetails = (details: PropertyBasicDetailsObject): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (details.bedrooms < 1) {
    errors.push("At least 1 bedroom is required");
  }

  if (details.bathrooms < 1) {
    errors.push("At least 1 bathroom is required");
  }

  if (details.size < 30) {
    errors.push("Property size must be at least 30m²");
  }

  if (details.size > 500) {
    errors.push("Property size cannot exceed 500m²");
  }

  // Validate custom bedrooms if bedrooms is 4+
  if (details.bedrooms === 4 && (!details.customBedrooms || details.customBedrooms < 4)) {
    errors.push("Custom bedroom count is required when selecting 'Other'");
  }

  // Validate custom bathrooms if bathrooms is 3+
  if (details.bathrooms === 3 && (!details.customBathrooms || details.customBathrooms < 3)) {
    errors.push("Custom bathroom count is required when selecting '3+'");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Property basic details utilities
export const getRenovationLabel = (renovation: "new" | "renovated" | "needs_work"): string => {
  const found = RENOVATION_STATUSES.find(r => r.id === renovation);
  return found?.label || "Unknown";
};

export const getRenovationDescription = (renovation: "new" | "renovated" | "needs_work"): string => {
  const found = RENOVATION_STATUSES.find(r => r.id === renovation);
  return found?.description || "";
};

export const getBedroomCount = (details: PropertyBasicDetailsObject): number => {
  return details.customBedrooms || details.bedrooms;
};

export const getBathroomCount = (details: PropertyBasicDetailsObject): number => {
  return details.customBathrooms || details.bathrooms;
};

export const getTotalRooms = (details: PropertyBasicDetailsObject): number => {
  let totalRooms = 0;

  // Add bedrooms
  totalRooms += getBedroomCount(details);

  // Add living room if it exists (separate from bedrooms)
  if (details.isOneBedroomLivingRoom) {
    totalRooms += 1;
  }

  return totalRooms;
};

export const getRoomBreakdown = (details: PropertyBasicDetailsObject): string => {
  const bedroomCount = getBedroomCount(details);
  const bathroomCount = getBathroomCount(details);
  const additionalRoomsCount = details.additionalRooms?.length || 0;
  const hasLivingRoom = details.isOneBedroomLivingRoom;

  let breakdown = [];

  // Bedrooms
  breakdown.push(`${bedroomCount} bedroom${bedroomCount !== 1 ? "s" : ""}`);

  // Living room
  if (hasLivingRoom) {
    breakdown.push("1 living room");
  }

  // Additional rooms
  if (additionalRoomsCount > 0) {
    breakdown.push(
      `${additionalRoomsCount} additional room${additionalRoomsCount !== 1 ? "s" : ""}`
    );
  }

  // Bathrooms
  breakdown.push(
    `${bathroomCount} bathroom${bathroomCount !== 1 ? "s" : ""}`
  );

  return breakdown.join(" • ");
};

export const getSizeDisplay = (details: PropertyBasicDetailsObject): string => {
  return `${details.size}m²`;
};

export const getAdditionalRoomsDisplay = (details: PropertyBasicDetailsObject): string => {
  if (!details.additionalRooms || details.additionalRooms.length === 0) {
    return "No additional rooms";
  }

  return details.additionalRooms.join(", ");
};

export const hasRoom = (details: PropertyBasicDetailsObject, room: string): boolean => {
  return details.additionalRooms?.includes(room) || false;
};

export const addRoom = (details: PropertyBasicDetailsObject, room: string): PropertyBasicDetailsObject => {
  const currentRooms = details.additionalRooms || [];
  if (!currentRooms.includes(room)) {
    return {
      ...details,
      additionalRooms: [...currentRooms, room]
    };
  }
  return details;
};

export const removeRoom = (details: PropertyBasicDetailsObject, room: string): PropertyBasicDetailsObject => {
  const currentRooms = details.additionalRooms || [];
  return {
    ...details,
    additionalRooms: currentRooms.filter(r => r !== room)
  };
};

// Property basic details step props
export interface PropertyBasicDetailsStepProps {
  data: PropertyBasicDetailsObject;
  onUpdate: (updates: Partial<PropertyBasicDetailsObject>) => void;
}
