export interface FilterData {
  // Basic Details
  bedrooms?: number;
  bathrooms?: number;
  hasLivingRoom?: boolean;
  minSize?: number;
  maxSize?: number;
  renovation?: "new" | "renovated" | "needs_work" | "any";
  
  // Additional Rooms
  additionalRooms?: string[];
  
  // Amenities
  amenities?: string[];
  
  // Price Range
  minPrice?: number;
  maxPrice?: number;
  
  // Location
  areas?: string[];
  
  // Property Type
  propertyType?: "entire_place" | "room" | "shared_room" | "any";
  
  // Availability
  availableFrom?: string;
  availableTo?: string;
}

export interface FilterStepProps {
  data: FilterData;
  onUpdate: (updates: Partial<FilterData>) => void;
}
