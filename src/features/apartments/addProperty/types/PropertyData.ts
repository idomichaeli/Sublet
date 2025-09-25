import { TelAvivLocation } from "../../../../shared/constants/locations";

export interface PropertyLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export type PropertyCategory = 
  | "house"
  | "apartment";

export type PropertyType = 
  | "entire_place"
  | "room"
  | "shared_room";

export interface PropertyData {
  // Step 0 - Property Category
  propertyCategory?: PropertyCategory;
  
  // Step 1 - Property Type
  propertyType?: PropertyType;

  // Contact Info
  name: string;
  email: string;
  phone: string;

  // Step 2 - Location
  location?: PropertyLocation;
  area?: TelAvivLocation;
  street: string;
  streetNumber: string;
  floor: string;
  apartmentNumber: string;
  postcode: string;
  hasShelter: boolean;
  shelterLocation?: "in_apartment" | "in_floor" | "in_building" | "other";
  shelterDistance?: number; // in meters, only if shelterLocation is "other"

  // Step 3 - Basic Details
  bedrooms: number;
  customBedrooms?: number; // For when bedrooms is , this stores the actual count (supports decimals)
  isOneBedroomLivingRoom: boolean; // Whether one of the bedrooms is a living room
  bathrooms: number;
  customBathrooms?: number; // For when bathrooms is 3+ (3), this stores the actual count (supports decimals)
  renovation: "new" | "renovated" | "needs_work";
  size: number;
  
  // Additional Room Options
  additionalRooms: string[]; // Array of selected additional rooms

  // Step 4 - Amenities
  amenities: string[];

  // Step 5 - Photos
  photos: string[];

  // Step 6 - Availability
  availableFrom?: string;
  availableTo?: string;
  startDateFlexibility?: "exact" | "3days" | "1week" | "2weeks";
  endDateFlexibility?: "exact" | "3days" | "1week" | "2weeks";

  // Step 7 - Pricing
  price: number;
  pricingFrequency: "week" | "month"; // Whether price is set by week or month
}

export interface StepProps {
  data: PropertyData;
  onUpdate: (updates: Partial<PropertyData>) => void;
}
